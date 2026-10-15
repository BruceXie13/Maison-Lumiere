// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @notice Valueless demo currency. A wallet may claim once. No deposits or redemption.
contract LumiToken is ERC20 {
    mapping(address => bool) public claimed;
    constructor() ERC20("Lumi Test Token", "LUM") {}
    function faucet() external {
        require(!claimed[msg.sender], "Already claimed");
        claimed[msg.sender] = true;
        _mint(msg.sender, 1000 ether);
    }
}

/// @notice Testnet-only art market. Wallets, not caller-supplied IDs, authorize actions.
/// @dev Experimental demo contract, not audited or intended for assets of value.
contract MaisonMarket is ERC721, ReentrancyGuard {
    using SafeERC20 for IERC20;
    LumiToken public immutable currency;
    uint256 public nextId;
    struct Profile { string name; string runtime; string strategy; }
    struct Artwork { string title; string image; string style; address creator; }
    struct Lot { uint256 id; string title; string image; string style; address creator; address owner; uint256 price; }
    struct Sale { uint256 tokenId; address seller; address buyer; uint256 price; uint256 royalty; uint256 timestamp; uint256 blockNumber; string reason; }
    mapping(address => Profile) public profiles;
    address[] public agentAddresses;
    mapping(uint256 => Artwork) public artworks;
    mapping(uint256 => uint256) public prices;
    Sale[] private sales;
    event AgentRegistered(address indexed agent, string name, string runtime);
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Trade(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 royalty, string reason);

    constructor() ERC721("Maison Lumiere", "MAISON") {
        require(block.chainid == 84532 || block.chainid == 31337, "Test networks only");
        currency = new LumiToken();
    }
    function registerAgent(string calldata name_, string calldata runtime_, string calldata strategy_) external {
        require(bytes(name_).length > 0 && bytes(name_).length <= 64, "Name: 1-64 bytes");
        require(bytes(runtime_).length <= 64 && bytes(strategy_).length <= 280, "Profile too long");
        if (bytes(profiles[msg.sender].name).length == 0) agentAddresses.push(msg.sender);
        profiles[msg.sender] = Profile(name_, runtime_, strategy_);
        emit AgentRegistered(msg.sender, name_, runtime_);
    }
    function mint(string calldata title_, string calldata image_, string calldata style_, uint256 price_) external nonReentrant returns(uint256 id) {
        require(bytes(profiles[msg.sender].name).length > 0, "Register agent first");
        require(bytes(title_).length > 0 && bytes(title_).length <= 120, "Title: 1-120 bytes");
        require(bytes(image_).length <= 512 && bytes(style_).length <= 64, "Metadata too long");
        id = nextId++;
        artworks[id] = Artwork(title_, image_, style_, msg.sender);
        _safeMint(msg.sender, id);
        prices[id] = price_;
        emit Listed(id, msg.sender, price_);
    }
    function list(uint256 id, uint256 price_) external {
        require(ownerOf(id) == msg.sender, "Only current owner");
        prices[id] = price_;
        emit Listed(id, msg.sender, price_);
    }
    function buy(uint256 id, address expectedSeller, uint256 expectedPrice, string calldata reason) external nonReentrant {
        require(bytes(profiles[msg.sender].name).length > 0, "Register agent first");
        require(bytes(reason).length <= 280, "Reason too long");
        address seller = ownerOf(id);
        uint256 price = prices[id];
        require(seller != msg.sender, "Already owner");
        require(price > 0 && seller == expectedSeller && price == expectedPrice, "Listing changed");
        address creator = artworks[id].creator;
        uint256 royalty = creator == seller ? 0 : price * 250 / 10000;
        _transfer(seller, msg.sender, id);
        IERC20(address(currency)).safeTransferFrom(msg.sender, seller, price - royalty);
        if (royalty > 0) IERC20(address(currency)).safeTransferFrom(msg.sender, creator, royalty);
        sales.push(Sale(id, seller, msg.sender, price, royalty, block.timestamp, block.number, reason));
        emit Trade(id, seller, msg.sender, price, royalty, reason);
    }
    // Every transfer invalidates the previous owner's offer, including external transfers.
    function _update(address to, uint256 id, address auth) internal override returns(address) {
        delete prices[id];
        return super._update(to, id, auth);
    }
    function tokenURI(uint256 id) public view override returns(string memory) {
        _requireOwned(id);
        Artwork memory a = artworks[id];
        return string.concat("data:application/json;base64,", Base64.encode(bytes(string.concat(
            '{"name":"', Strings.escapeJSON(a.title), '","description":"Unique testnet artwork. Copyright remains with its creator.","image":"',
            Strings.escapeJSON(a.image), '","attributes":[{"trait_type":"Style","value":"', Strings.escapeJSON(a.style), '"}]}'))));
    }
    function getLots(uint256 offset, uint256 count) external view returns(Lot[] memory out) {
        require(count <= 50, "Page too large");
        uint256 end = offset + count > nextId ? nextId : offset + count;
        if (offset >= end) return new Lot[](0);
        out = new Lot[](end - offset);
        for (uint256 i=offset; i<end; i++) {
            Artwork memory a = artworks[i];
            out[i-offset] = Lot(i, a.title, a.image, a.style, a.creator, ownerOf(i), prices[i]);
        }
    }
    function agentCount() external view returns(uint256) { return agentAddresses.length; }
    function saleCount() external view returns(uint256) { return sales.length; }
    function getSales(uint256 offset, uint256 count) external view returns(Sale[] memory out) {
        require(count <= 50, "Page too large");
        uint256 end = offset + count > sales.length ? sales.length : offset + count;
        if(offset >= end) return new Sale[](0);
        out = new Sale[](end-offset);
        for(uint256 i=offset; i<end; i++) out[i-offset] = sales[i];
    }
}
