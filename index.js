const conversionDescription = document.querySelector("h2");
const initialNumberSystemSelection = document.querySelector("#initial_number_system");
const targetNumberSystemSelection = document.querySelector("#target_number_system");
const numberToBeConverted = document.querySelector("#number_to_be_converted");
const convertedNumber = document.querySelector("#converted_number");

initialNumberSystemSelection.addEventListener("change", function () {
    const selectedNumberSystem = this.value;
    conversionDescription.firstElementChild.innerHTML = selectedNumberSystem.charAt(0).toUpperCase() + selectedNumberSystem.slice(1);
});

targetNumberSystemSelection.addEventListener("change", function () {
    const selectedNumberSystem = this.value;
    conversionDescription.lastElementChild.innerHTML = selectedNumberSystem.charAt(0).toUpperCase() + selectedNumberSystem.slice(1);
});


numberToBeConverted.addEventListener("keyup", function () {
    console.log(this.value);
})

// Checks the validity of the input in the inputBase using regex
const isValidBinary = input => /^[01]+$/.test(input);
const isValidDecimal = input => /^-?[0-9]+$/.test(input);
const isValidOctal = input => /^[0-7]+$/.test(input);
const isValidHexadecimal = input => /^[0-9a-fA-F]+$/.test(input);


function convertDecimalToBinary(decimalNumber) {
    if(!isValidDecimal(decimalNumber)) return "Invalid";
    const binaryValue = (decimalToBinary >= 0 ? (decimalNumber).toString(2): toTwosComplement(decimalNumber));
    return binaryValue;
}

function toTwosComplement(decimalNumber) {
    // Inverting the bits of the original binary number
    const onesComplement = (decimalNumber).toString(2).split("").map(digit => digit = (digit == 1 ? 0 : 1)).join("");

    // Adding 1 to the inverted binary number
    const twosComplement = addBinary((Math.abs(decimalNumber)).toString(2),(1).toString(2));
    return twosComplement;
}

function addBinary(a, b) {
    // Ensure both strings are of equal length by padding with zeros
    const maxLength = Math.max(a.length, b.length);
    a = a.padStart(maxLength, '0');
    b = b.padStart(maxLength, '0');
  
    let sum = '';
    let carry = 0;
  
    // Add binary numbers from the least significant bit
    for (let i = maxLength - 1; i >= 0; i--) {
      const bitA = parseInt(a.charAt(i), 10);
      const bitB = parseInt(b.charAt(i), 10);
  
      // Calculate sum of current bits and carry
      const currentSum = bitA + bitB + carry;
      sum += (currentSum % 2); // Current bit
      carry = Math.floor(currentSum / 2); // Carry for next iteration
    }
  
    // If there's a carry left, add it
    if (carry) sum = carry + sum;
  
    return sum;
}

function decimalToBinary(number) {
    if(typeof number == NaN) return; //prevents from unexpected errors

    let integerDivisionRemainder = [];
    let integerDivisionQuotient = [];
    let integerDivisionResult = Math.floor(number / 2);

    while(integerDivisionResult) {
        let remainder = number % 2;
        integerDivisionRemainder.unshift(remainder); //The binary representation is the sequence of remainders read in reverse order
        integerDivisionQuotient.push(integerDivisionResult)
    }

    return {integerDivisionRemainder, integerDivisionQuotient};
}
