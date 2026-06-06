// =============================================
// LESSONS-DATA.JS — all lesson content lives here
// Add new lessons by pushing to this array
// =============================================

const LESSONS = [
  {
    id: 0,
    slug: "js-basics-and-how-memory-works",
    title: "JS Basics & How Memory Works",
    subtitle: "How your computer stores data, what loops do, and why it matters.",
    emoji: "🧠",
    tags: ["memory", "stack", "heap", "loops", "basics"],
    brief: "Before you write a single variable, JS is already doing invisible work — allocating memory, setting up a call stack, and preparing to execute your code. Understanding <strong>how memory works</strong> (stack vs heap) and <strong>how loops repeat work</strong> (for, while, forEach) gives you the mental model that makes everything else in JS make sense.",
    sections: [
      {
        heading: "How memory works in JavaScript",
        body: `Your computer has two key memory areas JS uses: the <strong>Stack</strong> and the <strong>Heap</strong>. The stack is fast, small, and stores primitives (numbers, booleans, strings) and function call frames. The heap is large, slower, and stores objects and arrays. When you declare <code>let x = 5</code>, the number 5 lives on the stack. When you declare <code>let user = {}</code>, the object lives on the heap — and <code>user</code> on the stack holds a <em>reference</em> (like an address) pointing to it.`,
        code: `// Stack — primitives stored directly
let age  = 22;       // number lives ON the stack
let name = "Arjun";  // string lives ON the stack

// Heap — objects stored by reference
let user = { name: "Arjun", age: 22 };
// 'user' is on the stack, but the { } object is on the HEAP
// 'user' just holds the memory address of where that object is

// This is why copying objects is tricky:
let copy = user;         // copies the ADDRESS, not the object
copy.name = "Riya";
console.log(user.name);  // "Riya" — same object in heap!`
      },
      {
        heading: "The Call Stack — how functions run",
        body: `Every time you call a function, JS pushes a new "frame" onto the call stack. When the function finishes, that frame is popped off. This is why recursion that never ends causes a "Maximum call stack size exceeded" error — the stack literally runs out of space.`,
        code: `function greet(name) {
  return "Hello, " + name;
}

function main() {
  let result = greet("Arjun"); // greet() pushed onto stack
  console.log(result);         // greet() done → popped off
}

main(); // main() pushed → greet() pushed → greet() popped → main() popped

// Stack overflow example (infinite recursion):
// function boom() { return boom(); }
// boom(); // ❌ RangeError: Maximum call stack size exceeded`
      },
      {
        heading: "Loops — repeating work efficiently",
        body: `Loops let you run the same block of code multiple times without copy-pasting. JS has three main loop forms. <code>for</code> is the classic — use it when you know how many times to loop. <code>while</code> loops when a condition is true — use it when you don't know the count upfront. <code>for...of</code> iterates over any iterable (arrays, strings) cleanly.`,
        code: `// for loop — classic, count-controlled
for (let i = 0; i < 5; i++) {
  console.log("Step", i); // 0, 1, 2, 3, 4
}

// while loop — condition-controlled
let count = 0;
while (count < 3) {
  console.log("Count:", count);
  count++;
}

// for...of — clean iteration over arrays/strings
const fruits = ["mango", "banana", "apple"];
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in — iterates over object KEYS
const user = { name: "Arjun", age: 22 };
for (const key in user) {
  console.log(key + ":", user[key]);
}`
      },
      {
        heading: "Array loop methods — the modern way",
        body: `<code>forEach</code>, <code>map</code>, and <code>filter</code> are higher-order functions that replace most manual loops. They're cleaner, more expressive, and less error-prone than raw for loops when working with arrays.`,
        code: `const scores = [85, 42, 96, 71, 60];

// forEach — just run code for each item
scores.forEach(s => console.log(s));

// map — transform every item → new array
const doubled = scores.map(s => s * 2);
console.log(doubled); // [170, 84, 192, 142, 120]

// filter — keep items that pass a test → new array
const passing = scores.filter(s => s >= 70);
console.log(passing); // [85, 96, 71]

// Chaining — map then filter
const highDoubled = scores
  .filter(s => s >= 70)
  .map(s => s * 2);
console.log(highDoubled); // [170, 192, 142]`
      }
    ],
    playgroundCode: `// Memory & Loops playground
// 1. Primitives vs references
let a = 10;
let b = a;
b = 99;
console.log("a:", a, "b:", b); // a is unchanged

let obj1 = { x: 10 };
let obj2 = obj1;
obj2.x = 99;
console.log("obj1.x:", obj1.x); // also 99!

// 2. Loop through an array
const nums = [1, 2, 3, 4, 5];
const squares = nums.map(n => n * n);
console.log("Squares:", squares);

// 3. Fizzbuzz — a classic loop exercise
for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
    quiz: {
      question: "Where does JavaScript store objects and arrays in memory?",
      options: [
        { text: "On the Call Stack, like primitives", correct: false },
        { text: "On the Heap — and variables hold a reference to that location", correct: true },
        { text: "In the browser's localStorage", correct: false },
        { text: "In the CPU registers directly", correct: false }
      ]
    },
    badge: { emoji: "🧠", label: "Memory Master" }
  },

  {
    id: 1,
    slug: "how-js-stores-variables",
    title: "How JS Stores Variables",
    subtitle: "Memory, identifiers, and the var/let/const story.",
    emoji: "📦",
    tags: ["var", "let", "const", "memory"],
    brief: "JavaScript stores variables in memory and gives them a name — called an identifier — so you can refer to that value later. When you write <code>let name = 'Arjun'</code>, JS allocates a spot in memory, puts the string 'Arjun' there, and links the name <code>name</code> to that spot. Simple. But <em>how</em> you declare that variable (var, let, const) changes the rules entirely.",
    sections: [
      {
        heading: "var, let, const — what's the difference?",
        body: `<code>var</code> is the old way. It's function-scoped, hoisted to the top of its function, and can be re-declared — which caused a lot of bugs. <code>let</code> was introduced in ES6. It's block-scoped (lives only inside its curly braces), and can be reassigned but not re-declared in the same scope. <code>const</code> is also block-scoped but the binding cannot be reassigned. Note: <code>const</code> doesn't make objects immutable — just the reference.`,
        code: `// var — function scoped, hoisted
var x = 10;
var x = 20; // ✅ re-declaring is fine (bad practice)

// let — block scoped
let score = 0;
score = 100; // ✅ reassign ok
// let score = 200; ❌ can't re-declare

// const — block scoped, no reassign
const PI = 3.14;
// PI = 3; ❌ TypeError

// BUT objects/arrays with const are mutable
const user = { name: 'Arjun' };
user.name = 'Riya'; // ✅ the object itself changes
// user = {};        ❌ the reference cannot change`
      },
      {
        heading: "Hoisting — the invisible move",
        body: `JS "hoists" <code>var</code> declarations to the top of their function before code runs. The declaration goes up — but not the value. <code>let</code> and <code>const</code> are hoisted too, but they sit in a "temporal dead zone" and throw a ReferenceError if accessed before their line.`,
        code: `console.log(a); // undefined (not an error — hoisted)
var a = 5;

console.log(b); // ❌ ReferenceError — in TDZ
let b = 10;`
      }
    ],
    playgroundCode: `// Try it — declare variables three ways
var city = "Delhi";
let population = 33000000;
const country = "India";

console.log(city, population, country);

// What happens if you try to reassign const?
// country = "Nepal"; // uncomment to see the error`,
    quiz: {
      question: "What does 'block-scoped' mean for let and const?",
      options: [
        { text: "They only work inside functions", correct: false },
        { text: "They are only accessible within the curly braces { } they were declared in", correct: true },
        { text: "They can't be used with loops", correct: false },
        { text: "They are hoisted to the top of the file", correct: false }
      ]
    },
    badge: { emoji: "🧱", label: "Variable Vault" }
  },

  {
    id: 2,
    slug: "data-types",
    title: "Types of Data & How They Work",
    subtitle: "Primitives, non-primitives, and the stack vs heap.",
    emoji: "🔬",
    tags: ["string", "number", "boolean", "object", "null", "undefined"],
    brief: "JavaScript has 8 data types split into two camps: <strong>primitives</strong> (simple, stored by value) and <strong>non-primitives</strong> (complex, stored by reference). Knowing which category a value is in tells you how it behaves when you copy it, compare it, or pass it into a function.",
    sections: [
      {
        heading: "The 7 primitives",
        body: `Primitives are stored directly on the stack — a fast, fixed-size memory area. They are <strong>immutable</strong>: once created, the value itself cannot change. When you assign a primitive to a new variable, you get a full copy.`,
        code: `// The 7 primitive types
let str   = "hello";        // String
let num   = 42;             // Number
let big   = 9007199254n;    // BigInt
let bool  = true;           // Boolean
let empty = null;           // Null (intentional empty)
let undef = undefined;      // Undefined (unassigned)
let id    = Symbol("id");   // Symbol (unique key)

// Proof primitives are copied by VALUE
let a = "hello";
let b = a;       // b gets a COPY of "hello"
b = "world";
console.log(a);  // "hello" — a is untouched`
      },
      {
        heading: "Non-primitives (Objects & Arrays)",
        body: `Objects and arrays live on the heap — a larger, dynamic memory area. Variables don't hold the value directly — they hold a <em>reference</em> (like a pointer) to where the data lives. Copy a reference and both variables point to the same object.`,
        code: `// Stored by REFERENCE
let user1 = { name: "Arjun" };
let user2 = user1;       // user2 points to SAME object
user2.name = "Riya";
console.log(user1.name); // "Riya" ← user1 changed too!

// To actually copy: use spread
let user3 = { ...user1 };
user3.name = "Dev";
console.log(user1.name); // "Riya" ← now safe`
      }
    ],
    playgroundCode: `// Experiment with typeof
console.log(typeof "hello");     // string
console.log(typeof 42);          // number
console.log(typeof true);        // boolean
console.log(typeof undefined);   // undefined
console.log(typeof null);        // object ← famous bug!
console.log(typeof {});          // object
console.log(typeof []);          // object (arrays are objects)
console.log(typeof function(){}); // function`,
    quiz: {
      question: "If you do `let a = [1,2,3]; let b = a; b.push(4);` — what is a?",
      options: [
        { text: "[1, 2, 3] — a is unaffected", correct: false },
        { text: "[1, 2, 3, 4] — both a and b point to the same array", correct: true },
        { text: "undefined", correct: false },
        { text: "An error is thrown", correct: false }
      ]
    },
    badge: { emoji: "🔬", label: "Type Tamer" }
  },

  {
    id: 3,
    slug: "primitives-and-immutability",
    title: "Primitives Are Immutable",
    subtitle: "Why strings don't change even when you try.",
    emoji: "🔒",
    tags: ["immutable", "string", "mutation", "value"],
    brief: "Primitive values in JS are <strong>immutable</strong> — the actual value in memory cannot be changed. You can reassign a variable to point to a new value, but you cannot modify the original. This trips people up constantly with strings.",
    sections: [
      {
        heading: "String immutability in action",
        body: `When you try to change a character in a string like an array index, JS silently ignores it in non-strict mode, or throws in strict mode. The string is frozen.`,
        code: `let name = "hello";
name[0] = "H";          // Silently does nothing
console.log(name);      // "hello" — unchanged!

// To "change" a string, create a new one
let fixed = "H" + name.slice(1);
console.log(fixed);     // "Hello"
console.log(name);      // "hello" — still original`
      },
      {
        heading: "Reassignment ≠ mutation",
        body: `This is the key insight. Reassigning a variable is fine — you're just making it point to a <em>new</em> value. But the old primitive value itself is gone (garbage collected). You never changed it — you replaced it.`,
        code: `let score = 10;
// "Changing" a primitive just creates a new value
score = score + 5;
// 10 still existed in memory — score now points to 15
// The number 10 itself was never mutated

// Compare to an object (mutable):
const obj = { score: 10 };
obj.score = 15;  // The object itself IS mutated
// The reference in 'obj' stays the same`
      }
    ],
    playgroundCode: `// Test immutability
let word = "javascript";
word[0] = "J";
console.log(word); // still "javascript"

// String methods always return NEW strings
let upper = word.toUpperCase();
console.log(word);  // "javascript" unchanged
console.log(upper); // "JAVASCRIPT" — new string`,
    quiz: {
      question: "Why does `let s = 'hi'; s[0] = 'H';` not work?",
      options: [
        { text: "Because strings use double quotes, not single", correct: false },
        { text: "Because primitives are immutable — you can't mutate the value in place", correct: true },
        { text: "Because index 0 doesn't exist on strings", correct: false },
        { text: "Because you need to use let, not const", correct: false }
      ]
    },
    badge: { emoji: "🔒", label: "Immutability Insight" }
  },

  {
    id: 4,
    slug: "type-conversion",
    title: "Type Conversion",
    subtitle: "Explicit vs implicit — every way to convert types.",
    emoji: "🔄",
    tags: ["toString", "Number()", "Boolean()", "coercion", "implicit"],
    brief: "Type conversion is JS changing one type into another. There are two kinds: <strong>explicit</strong> (you do it on purpose with Number(), String(), Boolean()) and <strong>implicit</strong> (JS does it automatically, called coercion). Implicit coercion is where most JS bugs are born — but once you know the rules, you can use it intentionally.",
    sections: [
      {
        heading: "Explicit: toString, Number, Boolean",
        body: `Use these when you want to be clear and intentional about the conversion. They're predictable.`,
        code: `// → String
String(42)          // "42"
String(true)        // "true"
String(null)        // "null"
(42).toString()     // "42"
(255).toString(16)  // "ff" (hex!)

// → Number
Number("42")        // 42
Number("3.14")      // 3.14
Number("")          // 0
Number("hello")     // NaN
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN

// → Boolean
Boolean(0)          // false
Boolean("")         // false
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false
// Everything else is true ↓
Boolean(1)          // true
Boolean("hello")    // true
Boolean({})         // true (even empty object!)`
      },
      {
        heading: "Implicit coercion — JS doing its thing",
        body: `Coercion happens automatically when operators work with mixed types. The + operator with a string triggers string concatenation. Comparison operators like == trigger coercion. Use === to avoid it.`,
        code: `// + with strings → concatenation
"5" + 3       // "53" (3 coerced to string)
"5" + true    // "5true"

// - * / → number conversion
"5" - 3       // 2   ("5" coerced to number)
"5" * "2"     // 10
"5" - "x"     // NaN

// == triggers coercion (avoid this)
0 == false    // true  ← surprising
"" == false   // true  ← surprising
null == undefined // true ← sometimes useful

// === never coerces (always use this)
0 === false   // false ← correct`
      },
      {
        heading: "The && and || trick",
        body: `Logical operators in JS don't just return true/false — they return one of the actual operand values. This is incredibly useful.`,
        code: `// && returns the first falsy value, or the last value
true && "hello"      // "hello"  ← prints the string!
false && "hello"     // false
"a" && "b" && "c"   // "c"

// || returns the first truthy value
false || "hello"     // "hello"  (default value pattern)
"" || "default"      // "default"
null || 0 || "yes"   // "yes"

// Real usage:
let username = userInput || "Guest";
let greeting = isLoggedIn && "Welcome back!";`
      }
    ],
    playgroundCode: `// Play with coercion
console.log("5" + 3);        // "53"
console.log("5" - 3);        // 2
console.log(true && "hello"); // "hello"
console.log(false || "world"); // "world"
console.log(Boolean(0));      // false
console.log(Boolean(""));     // false
console.log(Boolean([]));     // true (!) — empty array is truthy`,
    quiz: {
      question: "What does `true && 'soldier'` evaluate to?",
      options: [
        { text: "true", correct: false },
        { text: "'soldier'", correct: true },
        { text: "false", correct: false },
        { text: "1", correct: false }
      ]
    },
    badge: { emoji: "🔄", label: "Conversion Commander" }
  },

  {
    id: 5,
    slug: "operators",
    title: "Operators",
    subtitle: "Arithmetic, comparison, logical, and the ternary.",
    emoji: "⚙️",
    tags: ["===", "!==", "&&", "||", "??", "ternary"],
    brief: "Operators are the symbols that perform actions on values. JS has arithmetic operators (+, -, *, /, %, **), comparison operators (===, !==, >, <), logical operators (&&, ||, !), and a few special ones like nullish coalescing (??) and the ternary (?:). Knowing them inside-out makes your code concise and expressive.",
    sections: [
      {
        heading: "Arithmetic operators",
        body: `Standard math plus two less obvious ones: <code>%</code> (remainder / modulo) and <code>**</code> (exponentiation). The <code>++</code> and <code>--</code> unary operators increment/decrement in place.`,
        code: `10 % 3    // 1 (remainder of 10 ÷ 3)
2 ** 10   // 1024 (2 to the power of 10)

let x = 5;
x++;      // x is now 6 (post-increment)
++x;      // x is now 7 (pre-increment)

// Unary + converts to number
+"42"     // 42 (number)
+true     // 1`
      },
      {
        heading: "Comparison: === vs ==",
        body: `Always use <code>===</code> (strict equality) — it checks value AND type. <code>==</code> (loose equality) coerces types first, leading to surprises. Same for <code>!==</code> vs <code>!=</code>.`,
        code: `// Strict (always prefer these)
5 === 5       // true
5 === "5"     // false — different types
null === undefined // false

// Loose (avoid)
5 == "5"      // true — coerces "5" to 5
0 == false    // true — both falsy

// Relational
5 > 3         // true
"b" > "a"    // true (alphabetical order)`
      },
      {
        heading: "Nullish coalescing ??",
        body: `The <code>??</code> operator is like <code>||</code> but only falls back for <code>null</code> and <code>undefined</code> — not for falsy values like 0 or empty string. Super useful for default values.`,
        code: `// || fallback for ALL falsy values
0 || "default"   // "default" ← might not want this
"" || "default"  // "default" ← might not want this

// ?? fallback ONLY for null/undefined
0 ?? "default"   // 0    ← keeps 0
"" ?? "default"  // ""   ← keeps empty string
null ?? "default"     // "default"
undefined ?? "default" // "default"

// Ternary operator: condition ? ifTrue : ifFalse
let age = 20;
let label = age >= 18 ? "adult" : "minor";
console.log(label); // "adult"`
      }
    ],
    playgroundCode: `// Test operators
console.log(10 % 3);           // 1
console.log(2 ** 8);           // 256
console.log(5 === "5");        // false
console.log(5 == "5");         // true
console.log(null ?? "default"); // "default"
console.log(0 ?? "default");    // 0
console.log(0 || "default");    // "default"

let x = 15;
console.log(x > 10 ? "big" : "small"); // "big"`,
    quiz: {
      question: "What does `0 ?? 'fallback'` return?",
      options: [
        { text: "'fallback'", correct: false },
        { text: "0", correct: true },
        { text: "null", correct: false },
        { text: "false", correct: false }
      ]
    },
    badge: { emoji: "⚙️", label: "Operator Overlord" }
  },

  {
    id: 6,
    slug: "functions",
    title: "Functions",
    subtitle: "Declarations, expressions, arrows, and scope.",
    emoji: "🧩",
    tags: ["function", "arrow", "scope", "return", "parameters"],
    brief: "Functions are reusable blocks of code. JS gives you three main ways to write them: function declarations (hoisted), function expressions (not hoisted), and arrow functions (concise, no own <code>this</code>). Each has its place.",
    sections: [
      {
        heading: "Three ways to write a function",
        body: `Each form has different hoisting and <code>this</code> behavior. Arrow functions are best for callbacks; declarations are best for top-level reusable logic.`,
        code: `// 1. Declaration — hoisted, can be called before definition
function greet(name) {
  return "Hello, " + name + "!";
}

// 2. Expression — not hoisted, stored in a variable
const greet2 = function(name) {
  return "Hi, " + name + "!";
};

// 3. Arrow — concise, no own 'this'
const greet3 = (name) => "Hey, " + name + "!";

// Single param? Drop the parens
const double = n => n * 2;

// No params? Keep empty parens
const sayHi = () => "Hello!";

console.log(greet("Arjun"));  // Hello, Arjun!
console.log(double(5));       // 10`
      },
      {
        heading: "Parameters, defaults, and return",
        body: `Functions can have default parameters (used when an argument is undefined) and must explicitly <code>return</code> a value — otherwise they return <code>undefined</code>.`,
        code: `// Default parameters
function power(base, exp = 2) {
  return base ** exp;
}
power(3);     // 9  (exp defaults to 2)
power(3, 3);  // 27

// Without return
function noReturn() {
  let x = 5; // does stuff but returns nothing
}
console.log(noReturn()); // undefined`
      }
    ],
    playgroundCode: `// Write your own functions
const add = (a, b) => a + b;
const multiply = (a, b = 1) => a * b;

console.log(add(3, 4));       // 7
console.log(multiply(5));     // 5
console.log(multiply(5, 3));  // 15

// typeof a function
console.log(typeof add);      // "function"`,
    quiz: {
      question: "What does an arrow function return if you don't use the `return` keyword with curly braces?",
      options: [
        { text: "undefined", correct: false },
        { text: "null", correct: false },
        { text: "The expression's value (implicit return)", correct: true },
        { text: "An error is thrown", correct: false }
      ]
    },
    badge: { emoji: "🧩", label: "Function Forger" }
  },

  {
    id: 7,
    slug: "type-checking",
    title: "typeof & Type Checking",
    subtitle: "How to inspect types at runtime.",
    emoji: "🔍",
    tags: ["typeof", "instanceof", "Array.isArray", "Number.isNaN"],
    brief: "JS is dynamically typed — variables don't have a fixed type. So at runtime you often need to check what type a value actually is. <code>typeof</code> is the main tool, but it has quirks (the null bug, arrays as objects). Knowing its limits — and the alternatives — makes you a safer developer.",
    sections: [
      {
        heading: "typeof — the main tool",
        body: `<code>typeof</code> returns a string describing the type. Works great for primitives, but watch out for the null and array edge cases.`,
        code: `typeof "hello"       // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof function(){}  // "function"

// THE QUIRKS:
typeof null          // "object" ← famous 30yr bug
typeof []            // "object" ← arrays are objects
typeof {}            // "object"

// Fix for arrays:
Array.isArray([])    // true
Array.isArray({})    // false`
      },
      {
        heading: "Number.isNaN vs global isNaN",
        body: `Global <code>isNaN()</code> coerces its argument first, causing surprises. <code>Number.isNaN()</code> is strict and only returns true for actual NaN values.`,
        code: `isNaN("hello")        // true (coerces "hello" → NaN)
isNaN(undefined)      // true (coerces undefined → NaN)
isNaN(NaN)            // true

Number.isNaN("hello") // false (no coercion)
Number.isNaN(NaN)     // true ← only this
Number.isNaN(undefined) // false`
      }
    ],
    playgroundCode: `// Type checking in action
const values = [42, "hello", true, null, undefined, [], {}, NaN];

values.forEach(v => {
  console.log(
    JSON.stringify(v) + " → typeof: " + typeof v +
    (Array.isArray(v) ? " [ARRAY]" : "") +
    (Number.isNaN(v) ? " [NaN]" : "")
  );
});`,
    quiz: {
      question: "What does `typeof null` return?",
      options: [
        { text: "'null'", correct: false },
        { text: "'undefined'", correct: false },
        { text: "'object'", correct: true },
        { text: "'boolean'", correct: false }
      ]
    },
    badge: { emoji: "🔍", label: "Type Detective" }
  },

  {
    id: 8,
    slug: "printing-and-output",
    title: "Printing & Output",
    subtitle: "console methods, template literals, and tricks.",
    emoji: "🖨️",
    tags: ["console.log", "template literals", "console.table", "console.warn"],
    brief: "Output in JS means talking to the console (for debugging) or the DOM (for users). The console has more methods than just <code>log</code> — and template literals make string building elegant. This lesson covers everything about getting JS to show you what's happening.",
    sections: [
      {
        heading: "console methods",
        body: `Beyond <code>console.log</code>, the console object is packed with useful methods for different situations.`,
        code: `console.log("Normal output");
console.warn("⚠ Something off");       // yellow
console.error("💥 Something broke");   // red
console.info("ℹ For your info");

// Grouping
console.group("User Data");
console.log("Name: Arjun");
console.log("Age: 22");
console.groupEnd();

// Tables — beautiful for arrays of objects
console.table([
  { name: "Arjun", age: 22 },
  { name: "Riya",  age: 20 }
]);

// Timing code
console.time("loop");
for (let i = 0; i < 1e6; i++) {}
console.timeEnd("loop");`
      },
      {
        heading: "Template literals — string superpowers",
        body: `Template literals use backticks and allow embedded expressions with <code>${"${}"}</code>. Multi-line strings, calculations, function calls — all inline.`,
        code: `const name = "Arjun";
const score = 98;

// Old way
console.log("Hello " + name + ", your score is " + score);

// Template literal
console.log(\`Hello \${name}, your score is \${score}\`);

// Inline expression
console.log(\`Double score: \${score * 2}\`);

// Multi-line (no \\n needed)
const msg = \`
  Name: \${name}
  Score: \${score}
  Grade: \${score >= 90 ? 'A' : 'B'}
\`;
console.log(msg);`
      }
    ],
    playgroundCode: `const lang = "JavaScript";
const year = 1995;

console.log(\`\${lang} was born in \${year}\`);
console.log(\`That's \${2024 - year} years ago!\`);

// Print through && operator
true && console.log("This prints");
false && console.log("This doesn't");

// console.table with an array
console.table([
  { type: "string",  example: "hello" },
  { type: "number",  example: 42 },
  { type: "boolean", example: true }
]);`,
    quiz: {
      question: "Which console method displays data as a formatted table?",
      options: [
        { text: "console.log()", correct: false },
        { text: "console.display()", correct: false },
        { text: "console.table()", correct: true },
        { text: "console.grid()", correct: false }
      ]
    },
    badge: { emoji: "🖨️", label: "Output Oracle" }
  },

  // ─── COMING SOON LESSONS (locked, not playable) ───────────────────────
  {
    id: 9,
    slug: "scope-and-closures",
    title: "Scope & Closures",
    subtitle: "Lexical scope, closure traps, and the module pattern.",
    emoji: "🔭",
    tags: ["scope", "closure", "lexical", "IIFE"],
    comingSoon: true,
    brief: "Coming soon.",
    sections: [],
    playgroundCode: "",
    quiz: { question: "", options: [] },
    badge: { emoji: "🔭", label: "Scope Scout" }
  },

  {
    id: 10,
    slug: "arrays-deep-dive",
    title: "Arrays Deep Dive",
    subtitle: "map, filter, reduce, flat, and everything in between.",
    emoji: "📚",
    tags: ["array", "map", "filter", "reduce", "spread"],
    comingSoon: true,
    brief: "Coming soon.",
    sections: [],
    playgroundCode: "",
    quiz: { question: "", options: [] },
    badge: { emoji: "📚", label: "Array Ace" }
  },

  {
    id: 11,
    slug: "objects-and-prototypes",
    title: "Objects & Prototypes",
    subtitle: "Dot notation, destructuring, spread, and prototype chains.",
    emoji: "🏛️",
    tags: ["object", "prototype", "destructuring", "spread"],
    comingSoon: true,
    brief: "Coming soon.",
    sections: [],
    playgroundCode: "",
    quiz: { question: "", options: [] },
    badge: { emoji: "🏛️", label: "Object Oracle" }
  },

  {
    id: 12,
    slug: "async-javascript",
    title: "Async JavaScript",
    subtitle: "Callbacks, Promises, async/await, and the event loop.",
    emoji: "⏳",
    tags: ["async", "await", "promise", "event loop"],
    comingSoon: true,
    brief: "Coming soon.",
    sections: [],
    playgroundCode: "",
    quiz: { question: "", options: [] },
    badge: { emoji: "⏳", label: "Async Architect" }
  }
];
