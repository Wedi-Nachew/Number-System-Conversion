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
const isValidDecimal = input => /^[0-9]+$/.test(input);
const isValidOctal = input => /^[0-7]+$/.test(input);
const isValidHexadecimal = input => /^[0-9a-fA-F]+$/.test(input);


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
