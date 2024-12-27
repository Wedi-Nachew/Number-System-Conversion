const conversionDescription = document.querySelector("h2");
const initialNumberSystemSelection = document.querySelector(
  "#initial_number_system"
);
const targetNumberSystemSelection = document.querySelector(
  "#target_number_system"
);
const numberToBeConverted = document.querySelector("#number_to_be_converted");
const convertBtn = document.querySelector("button");
const convertedNumber = document.querySelector("#converted_number");
const swapBtn = document.querySelector("button");
const details = document.querySelector("details");
const summary = document.querySelector("summary");
const containerInsideDetails = document.querySelector("details div");

let inputBase = "decimal";
let outputBase = "binary";

preventUserFromSelectingTheSameInputAndOutputBase();

initialNumberSystemSelection.addEventListener("change", function () {
  const selectedNumberSystem = this.value;
  inputBase = selectedNumberSystem;
  preventUserFromSelectingTheSameInputAndOutputBase();
  conversionDescription.firstElementChild.innerHTML =
    selectedNumberSystem.charAt(0).toUpperCase() +
    selectedNumberSystem.slice(1);
  convertNumber();
  explainConversion();
});

targetNumberSystemSelection.addEventListener("change", function () {
  const selectedNumberSystem = this.value;
  outputBase = selectedNumberSystem;
  preventUserFromSelectingTheSameInputAndOutputBase();
  conversionDescription.lastElementChild.innerHTML =
    selectedNumberSystem.charAt(0).toUpperCase() +
    selectedNumberSystem.slice(1);
  convertNumber();
  // explainConversion();
});

numberToBeConverted.addEventListener("input", function () {
  convertNumber();
  // explainConversion();
});

swapBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevents the button from submitting the form
  [inputBase, outputBase] = [outputBase, inputBase]; // Swapping input and output bases
  conversionDescription.firstElementChild.innerHTML =
    inputBase.charAt(0).toUpperCase() + inputBase.slice(1);
  conversionDescription.lastElementChild.innerHTML =
    outputBase.charAt(0).toUpperCase() + outputBase.slice(1);

  for (let option of targetNumberSystemSelection.children) {
    if (option.value != outputBase && option.hasAttribute("selected"))
      option.removeAttribute("selected");
    if (option.value == outputBase) option.setAttribute("selected", true);
  }

  for (let option of initialNumberSystemSelection.children) {
    if (option.value != inputBase && option.hasAttribute("selected"))
      option.removeAttribute("selected");
    if (option.value == inputBase) option.setAttribute("selected", true);
  }

  // [numberToBeConverted.value, convertedNumber.innerText] = [convertedNumber.innerText, numberToBeConverted.value]
  convertNumber();
});

details.addEventListener("toggle", function () {
  let input = numberToBeConverted.value;
  Array.from(containerInsideDetails.children).forEach((child) => {
    if (child != summary) details.removeChild(child);
  });
  if (inputBase == "decimal" && outputBase == "binary") {
    renderNegativeDecimalToBinary();
  } else if (inputBase == "decimal" && outputBase == "octal") {
    renderDecimalToOctalConversion();
  } else if (inputBase == "decimal" && outputBase == "hexadecimal") {
    renderDecimalToHexadecimalConversion();
  }
});

function formatExplanation(explanationArray) {
  // Determine the maximum widths for each column
  const maxStepLength = Math.max(
    ...explanationArray.map(
      (line) => line.substring(0, line.indexOf(":") + 1).length
    )
  );
  const maxDivisionLength = Math.max(
    ...explanationArray.map(
      (line) =>
        line.substring(line.indexOf(":") + 2, line.indexOf("r") - 1).length
    )
  );

  // Format each line
  const formattedExplanation = explanationArray.map((line) => {
    const step = line.substring(0, line.indexOf(":") + 1);
    const division = line.substring(
      line.indexOf(":") + 2,
      line.indexOf("r") - 1
    );
    const remainderPart = line.substring(line.indexOf("r") - 1);

    const formattedStep = step.padEnd(maxStepLength);
    const formattedDivision = division.padStart(maxDivisionLength);

    // Combine everything neatly
    return `${formattedStep}  ${formattedDivision}    ${remainderPart}`;
  });

  return formattedExplanation;
}

// Checks the validity of the input in the inputBase using regex
const isValidBinary = (input) => /^[01]+$/.test(input);
const isValidDecimal = (input) => /^-?[0-9]+$/.test(input);
const isValidOctal = (input) => /^[0-7]+$/.test(input);
const isValidHexadecimal = (input) => /^[0-9a-fA-F]+$/.test(input);

function renderDecimalToBinaryConversion() {
  let input = numberToBeConverted.value;
  const methodOfConversion = document.createElement("h3");
  const generalInstruction = document.createElement("h4");
  const listOfSteps = document.createElement("ol");
  const codeBlockDescription = document.createElement("h4");
  const codeBlock = document.createElement("pre"); // Use <pre> for preserving formatting
  const binaryResult = document.createElement("h4");
  const instructions = [
    "Divide the decimal number by 2.",
    "Record the remainder (0 or 1).",
    "Update the decimal number to the quotient of the division.",
    "Repeat until the quotient is 0.",
    "The binary representation is the sequence of remainders read in reverse order.",
  ];

  let { explanation: explanations, result } = convertAndExplainDecimalToBinary(
    parseInt(input, 10)
  );
  explanations = formatExplanation(explanations);

  methodOfConversion.innerText = "Method: Division-Remainder Method";
  generalInstruction.innerText = "General Procedure";

  for (let instruction of instructions) {
    const listItem = document.createElement("li");
    listItem.innerText = instruction;
    listOfSteps.appendChild(listItem);
  }

  containerInsideDetails.appendChild(methodOfConversion);
  containerInsideDetails.appendChild(generalInstruction);
  containerInsideDetails.appendChild(listOfSteps);

  codeBlockDescription.innerText = "Calculation";
  codeBlock.innerText = explanations
    .map((line, i) => {
      if (i === 0) return line + "  <-- Rightmost bit";
      if (i === explanations.length - 1) return line + "  <-- Leftmost bit";
      return line;
    })
    .join("\n"); // Add newline for proper formatting

  binaryResult.innerText = "Binary Result: " + result;

  containerInsideDetails.appendChild(codeBlockDescription);
  containerInsideDetails.appendChild(codeBlock);
  containerInsideDetails.appendChild(binaryResult);
  details.appendChild(containerInsideDetails);
}

function renderNegativeDecimalToBinary() {
  let input = numberToBeConverted.value;
  const methodOfConversion = document.createElement("h3");
  const generalInstruction = document.createElement("h4");
  const listOfSteps = document.createElement("ol");
  const codeBlockDescription = document.createElement("h4");
  const codeBlock = document.createElement("pre"); // Use <pre> for preserving formatting
  codeBlock.classList.add("container");
  const binaryResult = document.createElement("h4");
  const stepOneDescription = document.createElement("h5");
  const stepTwoDescription = document.createElement("h5");
  const stepThreeDescription = document.createElement("h5");
  const stepFourDescription = document.createElement("h5");
  const stepFiveDescription = document.createElement("h5");
  const stepOne = document.createElement("pre");
  const stepTwo = document.createElement("pre");
  const stepThree = document.createElement("pre");
  const headerForTheEquations = document.createElement("h5");
  const explanationForTheEquation = document.createElement("ul");
  const equationToDetermineNumberOfBits = document.createElement("pre");
  const generalEquation = document.createElement("pre");
  const specificEquation = document.createElement("pre")
  const instructions = [
    "Take the absolute value of the number.",
    "Determine the Number of Bits Needed.",
    "Write the Binary Number: Convert the positive decimal number into its binary equivalent using the determined number of bits.",
    "Invert the Bits: Flip all the bits of the binary number (change 0s to 1s and 1s to 0s).",
    "Add 1 to the Result: Add 1 to the inverted binary number.",
    "Handle Overflow (If Any): If there is a carry beyond the leftmost bit, ignore it (for fixed-width binary numbers).",
    "Final Output: The resulting binary number represents the 2's complement of the original number.",
  ];
  const equationExplanation = ["Explanation:",
    "The ∣N∣+1∣N∣+1 ensures you account for both positive and negative ranges.",
    "The ⌈log⁡2⌉⌈log2​⌉ rounds up to the nearest integer.",
    "Add 11 to account for the sign bit."
  ]; 

  let { explanation: explanations, result } = convertAndExplainDecimalToBinary(
    parseInt(input, 10)
  );
  // explanations = formatExplanation(explanations);

  methodOfConversion.innerText = "Method: Division-Remainder Method";
  generalInstruction.innerText = "General Procedure";

  headerForTheEquations.innerText = "Determine the number of bits needed to represent the number using the equation below";
  generalEquation.innerHTML = ` <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                                  <mi>n</mi>
                                  <mo>=</mo>
                                  <mo>⌈</mo>
                                  <mrow>
                                    <msub>
                                      <mi>log</mi>
                                      <mn>2</mn>
                                    </msub>
                                    <mo stretchy="false">(</mo>
                                    <mo>|</mo>
                                    <mi>N</mi>
                                    <mo>|</mo>
                                    <mo>+</mo>
                                    <mn>1</mn>
                                    <mo stretchy="false">)</mo>
                                  </mrow>
                                  <mo>⌉</mo>
                                  <mo>+</mo>
                                  <mn>1</mn>
                                </math>
                              `;
  specificEquation.innerHTML = ` <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                                  <mi>n</mi>
                                  <mo>=</mo>
                                  <mo>⌈</mo>
                                  <mrow>
                                    <msub>
                                      <mi>log</mi>
                                      <mn>2</mn>
                                    </msub>
                                    <mo stretchy="false">(</mo>
                                    <mo>|</mo>
                                    <mi>${input}</mi>
                                    <mo>|</mo>
                                    <mo>+</mo>
                                    <mn>1</mn>
                                    <mo stretchy="false">)</mo>
                                  </mrow>
                                  <mo>⌉</mo>
                                  <mo>+</mo>
                                  <mn>1</mn>
                                </math>
                                <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                                  <mi>n</mi>
                                  <mo>=</mo>
                                  <mi>${Math.ceil(Math.log2(Math.abs(input) + 1)) + 1}</mi>
                                </math>
                              `; 
  for(let explanation of equationExplanation) {
    const li = document.createElement("li");
    li.innerText = explanation;
    explanationForTheEquation.appendChild(li);
  }

  number = input;
  equationToDetermineNumberOfBits.appendChild(headerForTheEquations);
  equationToDetermineNumberOfBits.appendChild(generalEquation);
  equationToDetermineNumberOfBits.appendChild(explanationForTheEquation);
  equationToDetermineNumberOfBits.appendChild(specificEquation);
  for (let instruction of instructions) {
    const listItem = document.createElement("li");
    listItem.innerText = instruction;
    listOfSteps.appendChild(listItem);
  }

  containerInsideDetails.appendChild(methodOfConversion);
  containerInsideDetails.appendChild(generalInstruction);
  containerInsideDetails.appendChild(listOfSteps);
  codeBlockDescription.innerText = "Calculation";

  const stepOneDetails = explanations[0].map((line, i) => {
    if (i === 0) return line + "  <-- Rightmost bit";
    if (i === explanations.length-1) return line + "  <-- Leftmost bit";
    return line;
  });
  stepOneDescription.innerText = "Division Steps(Convert Decimal To Binary)";
  // stepOneDetails.unshift("Division Steps(Convert Decimal to Binary)"); //.join("\n");
  stepOne.innerText = stepOneDetails.join("\n"); // Add newline for proper formatting

  const stepTwoDetails = explanations[1].map((line, i) => {
    if (i === 0) return line + "  <-- Rightmost bit";
    if (i === explanations.length-1) return line + "  <-- Leftmost bit";
    return line;
  });
  stepTwoDescription.innerText = "Inverting The Bits";
  // stepTwoDetails.unshift("Inverting The bits");
  stepTwo.innerText = stepTwoDetails.join("\n");

  stepThreeDescription.innerText = "Final Addition Step";
  stepThree.innerText = explanations[2].join("\n");

  binaryResult.innerText = "Binary Result: " + result;
  containerInsideDetails.appendChild(codeBlockDescription);
  containerInsideDetails.appendChild(equationToDetermineNumberOfBits);
  containerInsideDetails.appendChild(stepOneDescription);
  containerInsideDetails.appendChild(stepOne);
  containerInsideDetails.appendChild(stepTwoDescription);
  containerInsideDetails.appendChild(stepTwo);
  containerInsideDetails.appendChild(stepThreeDescription);
  containerInsideDetails.appendChild(stepThree);
  containerInsideDetails.appendChild(binaryResult);
  details.appendChild(containerInsideDetails);
}

function renderDecimalToOctalConversion() {
  let input = numberToBeConverted.value;
  const methodOfConversion = document.createElement("h3");
  const generalInstruction = document.createElement("h4");
  const listOfSteps = document.createElement("ol");
  const codeBlockDescription = document.createElement("h4");
  const codeBlock = document.createElement("pre"); // Use <pre> for preserving formatting
  const octalResult = document.createElement("h4");
  const instructions = [
    "Divide the decimal number by 8.",
    "Record the remainder.",
    "Update the decimal number to the quotient of the division.",
    "Repeat until the quotient is 0.",
    "The octal representation is the sequence of remainders read in reverse order.",
  ];

  let { explanation: explanations, result } = convertAndExplainDecimalToOctal(
    parseInt(input, 10)
  );
  explanations = formatExplanation(explanations);

  methodOfConversion.innerText = "Method: Division-Remainder Method";
  generalInstruction.innerText = "General Procedure";

  for (let instruction of instructions) {
    const listItem = document.createElement("li");
    listItem.innerText = instruction;
    listOfSteps.appendChild(listItem);
  }

  containerInsideDetails.appendChild(methodOfConversion);
  containerInsideDetails.appendChild(generalInstruction);
  containerInsideDetails.appendChild(listOfSteps);

  codeBlockDescription.innerText = "Calculation";
  codeBlock.innerText = explanations
    .map((line, i) => {
      if (i === 0) return line + "  <-- Rightmost bit";
      if (i === explanations.length - 1) return line + "  <-- Leftmost bit";
      return line;
    })
    .join("\n"); // Add newline for proper formatting

  octalResult.innerText = "Octal Result: " + result;

  containerInsideDetails.appendChild(codeBlockDescription);
  containerInsideDetails.appendChild(codeBlock);
  containerInsideDetails.appendChild(octalResult);
  details.appendChild(containerInsideDetails);
}

function renderDecimalToHexadecimalConversion() {
  let input = numberToBeConverted.value;
  const methodOfConversion = document.createElement("h3");
  const generalInstruction = document.createElement("h4");
  const listOfSteps = document.createElement("ol");
  const codeBlockDescription = document.createElement("h4");
  const codeBlock = document.createElement("pre"); // Use <pre> for preserving formatting
  const hexadecimalResult = document.createElement("h4");
  const instructions = [
    "Divide the decimal number by 16.",
    "Record the remainder.",
    "Update the decimal number to the quotient of the division.",
    "Repeat until the quotient is 0.",
    "The hexadecimal representation is the sequence of remainders read in reverse order.",
  ];

  let { explanation: explanations, result } =
    convertAndExplainDecimalToHexadecimal(parseInt(input, 10));
  explanations = formatExplanation(explanations);

  methodOfConversion.innerText = "Method: Division-Remainder Method";
  generalInstruction.innerText = "General Procedure";

  for (let instruction of instructions) {
    const listItem = document.createElement("li");
    listItem.innerText = instruction;
    listOfSteps.appendChild(listItem);
  }

  containerInsideDetails.appendChild(methodOfConversion);
  containerInsideDetails.appendChild(generalInstruction);
  containerInsideDetails.appendChild(listOfSteps);

  codeBlockDescription.innerText = "Calculation";
  codeBlock.innerText = explanations
    .map((line, i) => {
      if (i === 0) return line + "  <-- Rightmost bit";
      if (i === explanations.length - 1) return line + "  <-- Leftmost bit";
      return line;
    })
    .join("\n"); // Add newline for proper formatting

  hexadecimalResult.innerText = "Hexadecimal Result: " + result;

  containerInsideDetails.appendChild(codeBlockDescription);
  containerInsideDetails.appendChild(codeBlock);
  containerInsideDetails.appendChild(hexadecimalResult);
  details.appendChild(containerInsideDetails);
}

function preventUserFromSelectingTheSameInputAndOutputBase() {
  for (let option of targetNumberSystemSelection.children) {
    if (option.value != inputBase && option.hasAttribute("disabled"))
      option.removeAttribute("disabled");
    if (option.value == inputBase) option.setAttribute("disabled", true);
  }

  for (let option of initialNumberSystemSelection.children) {
    if (option.value != outputBase && option.hasAttribute("disabled"))
      option.removeAttribute("disabled");
    if (option.value == outputBase) option.setAttribute("disabled", true);
  }
}

function convertNumber() {
  let input = numberToBeConverted.value;
  if (inputBase == "decimal" && outputBase == "binary") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertAndExplainDecimalToBinary(parseInt(input, 10)).result
      : "";
  } else if (inputBase == "decimal" && outputBase == "octal") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertAndExplainDecimalToOctal(parseInt(input, 10)).result
      : "";
  } else if (inputBase == "decimal" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidDecimal(input)
      ? convertAndExplainDecimalToHexadecimal(parseInt(input, 10)).result
      : "";
  } else if (inputBase == "binary" && outputBase == "decimal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertAndExplainBinaryToDecimal(input).result
      : "";
  } else if (inputBase == "binary" && outputBase == "octal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertAndExplainBinaryToOctal(input).result
      : "";
  } else if (inputBase == "binary" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidBinary(input)
      ? convertAndExplainBinaryToHexadecimal(input).result
      : "";
  } else if (inputBase == "octal" && outputBase == "binary") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertAndExplainOctalToBinary(input).result
      : "";
  } else if (inputBase == "octal" && outputBase == "decimal") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertAndExplainOctalToDecimal(input).result
      : "";
  } else if (inputBase == "octal" && outputBase == "hexadecimal") {
    convertedNumber.innerText = isValidOctal(input)
      ? convertAndExplainOctalToHexadecimal(input).result
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "binary") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertAndExplainHexadecimalToBinary(input).result
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "decimal") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertAndExplainHexadecimalToDecimal(input).result
      : "";
  } else if (inputBase == "hexadecimal" && outputBase == "octal") {
    convertedNumber.innerText = isValidHexadecimal(input)
      ? convertAndExplainHexadecimalToOctal(input).result
      : "";
  }
}

function convertAndExplainDecimalToBinary(decimalNumber) {
  return decimalNumber >= 0
    ? convertAndExplainPositiveDecimalToBinary(decimalNumber)
    : convertAndExplainNegativeDecimalToBinary(decimalNumber);
}

function addBinary(a, b) {
  // Ensure both strings are of equal length by padding with zeros
  const maxLength = Math.max(a.length, b.length);
  a = a.padStart(maxLength, "0");
  b = b.padStart(maxLength, "0");

  let sum = "";
  let carry = 0;

  // Add binary numbers from the least significant bit
  for (let i = maxLength - 1; i >= 0; i--) {
    const bitA = parseInt(a.charAt(i), 10);
    const bitB = parseInt(b.charAt(i), 10);

    // Calculate sum of current bits and carry
    const currentSum = bitA + bitB + carry;
    sum += currentSum % 2; // Current bit
    carry = Math.floor(currentSum / 2); // Carry for next iteration
  }

  // If there's a carry left, add it
  if (carry) sum += carry;

  //reverses sum string
  sum = sum.split("").reverse().join("");

  return sum;
}

function convertAndExplainPositiveDecimalToBinary(decimalNumber) {
  let steps = [];
  let currentDecimalValue = decimalNumber;
  let binaryString = "";

  // let counter = 1;
  while (currentDecimalValue) {
    const remainder = currentDecimalValue % 2;
    steps.push(
      `Division Step ${
        steps.length + 1
      }: ${currentDecimalValue} ÷ 2 = ${Math.floor(
        currentDecimalValue / 2
      )} remainder ${remainder}`
    );
    currentDecimalValue = Math.floor(currentDecimalValue / 2);
    binaryString += remainder;
  }

  binaryString = binaryString.split("").reverse().join("");

  return { explanation: steps, result: binaryString };
}

function convertAndExplainNegativeDecimalToBinary(decimalNumber) {
  /* General equation to determine the number of bits(n) needed to 
     represent a number(i.e. N) in 2's complement is n=⌈log2​(∣N∣+1)⌉+1 */

  decimalNumber = Math.abs(decimalNumber);
  let numberOfBitsRequired = Math.ceil(Math.log2(decimalNumber + 1)) + 1;
  let { explanation: stepOne, result: binaryString } =
    convertAndExplainPositiveDecimalToBinary(decimalNumber);

  //Represents the decimal number in the appropriate number of bits
  while (stepOne.length < numberOfBitsRequired)
    stepOne.push(`Division Step ${stepOne.length + 1}: 0 ÷ 2 = 0 remainder 0`);

  let binaryArray = binaryString.split("");

  //Represents the decimal number in the appropriate number of bits
  while (binaryArray.length < numberOfBitsRequired) binaryArray.unshift(0);
  let stepTwo = [];
  let onesComplement = binaryArray
    .map((digit) => (digit = digit == 1 ? 0 : 1))
    .join("");
  for (let i = 0; i < binaryArray.length; i++)
    stepTwo.push(
      `Inverting Step ${i + 1}: ${binaryArray[i]} --> ${onesComplement[i]}`
    );

  let stepThree = [];
  let twosComplement = addBinary(onesComplement, "1");
  stepThree.push(
    `   ${twosComplement}`,
    `+ ${"1".padStart(twosComplement.length, 0)}`
  );

  return { explanation: [stepOne, stepTwo, stepThree], result: twosComplement };
}

function convertAndExplainDecimalToOctal(decimalNumber) {
  let steps = [];
  let currentDecimalValue = decimalNumber;
  let octalValue = "";

  while (currentDecimalValue) {
    const contribution = currentDecimalValue % 8;
    steps.push(
      `Step ${steps.length + 1}: ${currentDecimalValue} ÷ 8 = ${Math.floor(
        currentDecimalValue / 8
      )} remainder ${currentDecimalValue % 8}`
    );
    currentDecimalValue = Math.floor(currentDecimalValue / 8);
    octalValue += contribution.toString(8);
  }

  octalValue = octalValue.split("").reverse().join("");

  return { explanation: steps, result: octalValue };
}

function convertAndExplainDecimalToHexadecimal(decimalNumber) {
  let steps = [];
  let currentDecimalValue = decimalNumber;
  let hexadecimalString = "";

  while (currentDecimalValue) {
    const contribution = currentDecimalValue % 16;
    steps.push(
      `Step ${steps.length + 1}: ${currentDecimalValue} ÷ 16 = ${Math.floor(
        currentDecimalValue / 16
      )} remainder ${currentDecimalValue % 16}`
    );
    currentDecimalValue = Math.floor(currentDecimalValue / 16);
    hexadecimalString += contribution.toString(16)?.toUpperCase();
  }

  hexadecimalString = hexadecimalString.split("").reverse().join("");

  return { explanation: steps, result: hexadecimalString };
}

function convertAndExplainBinaryToDecimal(binaryString) {
  let steps = [];
  let decimalValue = 0;
  const binaryArray = binaryString.split("").reverse();

  binaryArray.forEach((bit, index) => {
    let contribution = parseInt(bit) * 2 ** index;
    steps.push(
      `Bit ${bit} at position ${index}: ${bit} * 2**${index} = ${contribution}`
    );
    decimalValue += contribution;
  });

  return { explanation: steps, result: decimalValue };
}

function convertAndExplainBinaryToOctal(binaryString) {
  let steps = [];
  let octalString = "";
  let binaryArray = binaryString.split("");

  let remainder = binaryArray.length % 3;
  if (remainder) for (let i = 0; i < 3 - remainder; i++) binaryArray.unshift(0);

  for (let i = 0; i < binaryArray.length - 1; i += 3) {
    let decimalValue = convertAndExplainBinaryToDecimal(
      `Step ${steps.length + 1}: ${binaryArray[i]}${binaryArray[i + 1]}${
        binaryArray[i + 2]
      }`
    ).result;
    steps.push(
      `${binaryArray[i]}${binaryArray[i + 1]}${
        binaryArray[i + 2]
      } --> ${decimalValue}`
    );
    octalString += decimalValue;
  }

  return { explanation: steps, result: octalString };
}

function convertAndExplainBinaryToHexadecimal(binaryString) {
  let steps = [];
  let hexadecimalString = "";
  let binaryArray = binaryString.split("");

  let remainder = binaryArray.length % 4;
  if (remainder) for (let i = 0; i < 4 - remainder; i++) binaryArray.unshift(0);

  for (let i = 0; i < binaryArray.length - 1; i += 4) {
    let decimalValue = convertAndExplainBinaryToDecimal(
      `${binaryArray[i]}${binaryArray[i + 1]}${binaryArray[i + 2]}${
        binaryArray[i + 3]
      }`
    ).result;
    steps.push(
      `${binaryArray[i]}${binaryArray[i + 1]}${binaryArray[i + 2]}${
        binaryArray[i + 3]
      } --> ${decimalValue}`
    );
    hexadecimalString += decimalValue.toString(16)?.toUpperCase();
  }

  return { explanation: steps, result: hexadecimalString };
}

function convertAndExplainOctalToDecimal(octalNumber) {
  let steps = [];
  const octalArray = octalNumber.toString().split("").reverse();
  let decimalValue = 0;

  octalArray.forEach((digit, index) => {
    let contribution = parseInt(digit) * 8 ** index;
    steps.push(
      `${digit} at position ${index}: ${digit} * 8**${index} = ${contribution}`
    );
    decimalValue += contribution;
  });

  return { explanation: steps, result: decimalValue };
}

function convertAndExplainOctalToBinary(octalNumber) {
  let steps = [];
  let binaryString = "";
  const octalArray = octalNumber.toString().split("");

  for (let digit of octalArray) {
    const contribution = parseInt(digit, 8).toString(2);
    steps.push(`${digit} --> ${contribution}`);
    binaryString += contribution;
  }

  return { explanation: steps, result: binaryString };
}

function convertAndExplainOctalToHexadecimal(octalNumber) {
  let { explanation: stepOne, result: binaryString } =
    convertAndExplainOctalToBinary(octalNumber);
  let { explanation: stepTwo, result: hexadecimalString } =
    convertAndExplainBinaryToHexadecimal(binaryString);

  return { explanation: [stepOne, stepTwo], result: hexadecimalString };
}

function convertAndExplainHexadecimalToDecimal(hexadecimalString) {
  let steps = [];
  let decimalValue = 0;
  const hexadecimalArray = hexadecimalString.split("").reverse();

  hexadecimalArray.forEach((digit, index) => {
    const contribution = parseInt(digit, 16) * 16 ** index;
    steps.push(
      `${digit} at position ${index}: ${parseInt(
        digit,
        16
      )} * 16**${index} = ${contribution}`
    );
    decimalValue += contribution;
  });

  return { explanation: steps, result: decimalValue };
}

function convertAndExplainHexadecimalToBinary(hexadecimalString) {
  let steps = [];
  let binaryString = "";
  let hexadecimalArray = hexadecimalString.split("");
  hexadecimalArray.forEach((digit) => {
    const contribution = parseInt(digit, 16).toString(2);
    steps.push(`${digit} --> ${contribution}`);
    binaryString += contribution;
  });

  return { explanation: steps, result: binaryString };
}

function convertAndExplainHexadecimalToOctal(hexadecimalString) {
  let { explanation: stepOne, result: binaryString } =
    convertAndExplainHexadecimalToBinary(hexadecimalString);
  let { explanation: stepTwo, result: octalValue } =
    convertAndExplainBinaryToOctal(binaryString);

  return { explanation: [stepOne, stepTwo], result: octalValue };
}
