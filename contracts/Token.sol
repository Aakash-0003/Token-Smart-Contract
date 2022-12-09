//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Token {
    string private tokenName;
    string private tokenSymbol;
    uint8 private tokenDecimals;
    uint256 private tokenTotalSupply;

    /* balances mapping 
    to keep track of balance(uint256) 
    of corresponding address
    */
    mapping(address => uint256) private balances;
    /*allowances mapping 
    to keep track of addresses allowing 
    other spenders(address) to spend their amount
    */
    mapping(address => mapping(address => uint256)) private allowances;

    /*Transfer event - 
    to keep track of all the transfers occured between addresses and their amount
    */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    /*Approval event - 
    to keep track of all the approvals given to spender by owner and their amount
    */
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    modifier notZeroAddress(address _address) {
        require(_address != address(0), "Zero Address");
        _;
    }

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals,
        uint256 _initialOwnerBalance
    ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        tokenDecimals = _tokenDecimals;
        tokenTotalSupply = _initialOwnerBalance;
        balances[msg.sender] = _initialOwnerBalance;
    }

    /* Returns Token's Name
     */
    function name() external view returns (string memory _name) {
        return tokenName;
    }

    /* Returns Token's Symbol
     */
    function symbol() external view returns (string memory _symbol) {
        return tokenSymbol;
    }

    /* Returns Number of Decimals Token's Value
     */
    function decimals() external view returns (uint8 _decimals) {
        return tokenDecimals;
    }

    /* Returns Token's Total Supply
     */
    function totalSupply() external view returns (uint256 _totalSupply) {
        return tokenTotalSupply;
    }

    /* Returns Balance of specfic address
     */
    function balanceOf(address _owner)
        external
        view
        notZeroAddress(_owner)
        returns (uint256 _balance)
    {
        return balances[_owner];
    }

    /* Function Transfer
     transfers given Value to given Address 
    */
    function transfer(address _to, uint256 _value)
        public
        notZeroAddress(_to)
        returns (bool _success)
    {
        require(balances[msg.sender] >= _value, "Insufficient Balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return _success = true;
    }

    /* Function Approve
       msg.sender approves spender address by giving given value as allowance
    */
    function approve(address _spender, uint256 _value)
        public
        notZeroAddress(_spender)
        returns (bool _success)
    {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return _success = true;
    }

    /* Function Allowance
    returns allowance remaining for spender from  given owner
    */
    function allowance(address _owner, address _spender)
        external
        view
        notZeroAddress(_owner)
        notZeroAddress(_spender)
        returns (uint256 _allowance)
    {
        return allowances[_owner][_spender];
    }

    /* Function increase Allowance
    increases allowance  for spender from  given owner
    */
    function increaseAllowance(address _spender, uint256 _value)
        public
        returns (bool _success)
    {
        require(balances[msg.sender] >= _value, "Insufficient Balance");
        allowances[msg.sender][_spender] += _value;
        return _success = true;
    }

    /* Function decrease Allowance
    increases allowance  for spender from  given owner
    */
    function decreaseAllowance(address _spender, uint256 _value)
        public
        returns (bool _success)
    {
        require(balances[msg.sender] >= _value, "Insufficient Balance");
        allowances[msg.sender][_spender] -= _value;
        return _success = true;
    }

    /* Function Transferfrom
    transfer given value from given address to given address 
    */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public notZeroAddress(_from) notZeroAddress(_to) returns (bool _success) {
        require(balances[_from] >= _value, "Insufficient Balance");
        require(
            allowances[_from][msg.sender] >= _value,
            "Insufficient Allowance"
        );
        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return _success = true;
    }
}
