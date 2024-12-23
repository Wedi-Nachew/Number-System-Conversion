const conversionDescription = document.querySelector("h2");
const initialNumberSystemSelection = document.querySelector("#initial_number_system");
const targetNumberSystemSelection = document.querySelector("#target_number_system");
const numberToBeConverted = document.querySelector("#number_to_be_converted");
const convertBtn = document.querySelector("button");
const convertedNumber = document.querySelector("#converted_number");

let inputBase = "decimal";
let outputBase = "binary";

preventUserFromSelectingTheSameInputAndOutputBase();

initialNumberSystemSelection.addEventListener("change", function () {
    const selectedNumberSystem = this.value;
    inputBase = selectedNumberSystem;
    preventUserFromSelectingTheSameInputAndOutputBase();
    conversionDescription.firstElementChild.innerHTML = selectedNumberSystem.charAt(0).toUpperCase() + selectedNumberSystem.slice(1);
    convertNumber();
});


targetNumberSystemSelection.addEventListener("change", function () {  
    const selectedNumberSystem = this.value;
    outputBase = selectedNumberSystem;
    preventUserFromSelectingTheSameInputAndOutputBase();
    conversionDescription.lastElementChild.innerHTML = selectedNumberSystem.charAt(0).toUpperCase() + selectedNumberSystem.slice(1);
    convertNumber();
});

function preventUserFromSelectingTheSameInputAndOutputBase() {
    for(let option of targetNumberSystemSelection.children) {
        if (option.value != inputBase && option.hasAttribute("disabled")) option.removeAttribute("disabled");
        if (option.value == inputBase) option.setAttribute("disabled", true);
    }

    for(let option of initialNumberSystemSelection.children) {
        if (option.value != outputBase && option.hasAttribute("disabled")) option.removeAttribute("disabled");
        if (option.value == outputBase) option.setAttribute("disabled", true);
    }
}

numberToBeConverted.addEventListener("input", function () {
  convertNumber();
});

// Checks the validity of the input in the inputBase using regex
const isValidBinary = input => /^[01]+$/.test(input);
const isValidDecimal = input => /^-?[0-9]+$/.test(input);
const isValidOctal = input => /^[0-7]+$/.test(input);
const isValidHexadecimal = input => /^[0-9a-fA-F]+$/.test(input);

function convertNumber() {
  let input = numberToBeConverted.value;
  if (inputBase == "decimal" && outputBase == "binary") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertDecimalToBinary(parseInt(input, 10))
      : "";
  } else if (inputBase == "decimal" && outputBase == "octal") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertDecimalToOctal(parseInt(input, 10))
      : "";
  } else if (inputBase == "decimal" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertDecimalToHexadecimal(parseInt(input, 10))
      : "";
  } else if (inputBase == "binary" && outputBase == "decimal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertBinaryToDecimal(input)
      : "";
  } else if (inputBase == "binary" && outputBase == "octal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertBinaryToOctal(input)
      : "";
  } else if (inputBase == "binary" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertBinaryToHexadecimal(input)
      : "";
  } else if (inputBase == "octal" && outputBase == "binary") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertOctalToBinary(parseInt(input, 8))
      : "";
  } else if (inputBase == "octal" && outputBase == "decimal") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertOctalToDecimal(parseInt(input, 8))
      : "";
  } else if (inputBase == "octal" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertOctalToHexadecimal(parseInt(input, 8))
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "binary") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertHexadecimalToBinary(input)
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "decimal") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertHexadecimalToDecimal(input)
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "octal") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertHexadecimalToOctal(input)
      : "";
  }
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

function convertDecimalToBinary(decimalNumber) {
    if(!isValidDecimal(decimalNumber)) return;
    return decimalNumber >= 0 ? (decimalNumber).toString(2) : toTwosComplement(decimalNumber);
}

function convertDecimalToOctal(decimalNumber) {
    if(!isValidDecimal(decimalNumber)) return;
    return (decimalNumber).toString(8);
} 

function convertDecimalToHexadecimal(decimalNumber) {
    if(!isValidDecimal(decimalNumber)) return;
    return (decimalNumber).toString(16).toUpperCase();
}

function convertBinaryToDecimal(binaryString) {
    if(!isValidBinary(binaryString)) return;
    return parseInt(binaryString, 2);
}

function convertBinaryToOctal(binaryString) {
    if(!isValidBinary(binaryString)) return;
    const decimalValue = convertBinaryToDecimal(binaryString);
    const octalValue = convertDecimalToOctal(decimalValue);
    return octalValue;
}

function convertBinaryToHexadecimal(binaryString) {
    if(!isValidBinary(binaryString)) return;
    const decimalValue = convertBinaryToDecimal(binaryString);
    const hexadecimalValue = convertDecimalToHexadecimal(decimalValue).toUpperCase();
    return hexadecimalValue;
}

function convertOctalToDecimal(octalNumber) {
    if(!isValidOctal(octalNumber)) return;
    return parseInt(octalNumber, 8);
}

function convertOctalToBinary(octalNumber) {
    if(!isValidOctal(octalNumber)) return;
    const decimalValue = convertOctalToDecimal(octalNumber);
    const binaryValue = convertDecimalToBinary(decimalValue);
    return binaryValue;
}

function convertOctalToHexadecimal(hexadecimalNumber) {
    if(!isValidOctal(hexadecimalNumber)) return;
    const decimalValue = convertOctalToDecimal(hexadecimalNumber);
    const hexadecimalValue = convertDecimalToHexadecimal(decimalValue).toUpperCase();
    return hexadecimalValue;
}

function convertHexadecimalToDecimal(hexadecimalNumber) {
    if(!hexadecimalNumber) return;
    return parseInt(hexadecimalNumber, 16);
}

function convertHexadecimalToBinary(hexadecimalNumber) {
    if(!isValidHexadecimal(hexadecimalNumber)) return;
    const decimalValue = convertHexadecimalToDecimal(hexadecimalNumber);
    const binaryValue = convertDecimalToBinary(decimalValue);
    return binaryValue;
}

function convertHexadecimalToOctal(hexadecimalNumber) {
    if(!isValidHexadecimal(hexadecimalNumber)) return;
    const decimalValue = convertHexadecimalToDecimal(hexadecimalNumber);
    const octalValue = convertDecimalToOctal(decimalValue);
    return binaryValue;
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
