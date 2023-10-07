'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', 
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const accounts2 = [account1,account2]

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Compute usernames
const createUsernames = function (accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
};
createUsernames(accounts);
console.log(accounts);

//Display movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? [...movements].sort((a,b)=> a-b) : movements;
  movs.forEach(function(mov,i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};

//Calculate and Display balance
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov)=> acc+mov,0);
  labelBalance.innerHTML = `${acc.balance}$`;
};

//Display Summary (Deposit, Withdraw, Interest)
const calcDisplaySummary = function (acc){
  const incomes = acc.movements.filter(mov => mov>0)
  .reduce((acc,mov)=>acc+mov,0);
  labelSumIn.textContent = `${incomes}€`
  const out = acc.movements.filter(mov => mov <0)
  .reduce((acc,mov) => acc+mov,0);
  labelSumOut.textContent = `${Math.abs(out)}€`
  const interest = acc.movements.filter(mov => mov>0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter(int => int >= 1)
  .reduce((acc,interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
  console.log(interest)
};

const updateUI = function (acc){
     //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
   //Display summary
  calcDisplaySummary(acc);
}

let currentAccount;
//Event handler with log in button 
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  //find the current account
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
    }
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.userName === inputTransferTo.value);
  //Clear input fields
  inputTransferAmount.value = inputTransferTo.value = ' ';
  //Check condition of transfer
  if(amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.userName !== currentAccount.userName){
    console.log('Transfer valid!')
  }
  //Add negative movement to current user and positive movement to recipient
  currentAccount.movements.push(-amount);
  receiverAccount.movements.push(amount);
  updateUI(currentAccount);
});
//Loan function
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
})

//Close account
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    console.log(index);
  // delete account from array
    accounts.splice(index,1);
  //hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = ' ';
  }
});

let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


const x = new Array(7);
console.log(x);
x.fill(7);
console.log(x);

const y = Array.from({length:7},()=>1);
console.log(y);

labelBalance.addEventListener('click',function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€','')));
  console.log(movementsUI);
});

const bankDepositSum = accounts.map(acc => acc.movements).flat().filter(mov => mov >0).reduce((acc,mov)=>acc+mov,0);
console.log(bankDepositSum); 

const numDeposit1000 = accounts.flatMap(acc => acc.movements).reduce((count,cur) => cur >= 1000 ? count+1 : count,0);
console.log(numDeposit1000);

//Parsing
console.log(Number.isNaN(20));
  
