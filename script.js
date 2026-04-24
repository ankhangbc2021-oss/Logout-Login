const inputs = document.querySelectorAll(".input-group input");
const input_real = document.querySelectorAll(".input");

inputs.forEach(input => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("active");
  });

  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.parentElement.classList.remove("active");
    }
  });
});

input_real.forEach(input => {
  input.addEventListener('focus', () => {
    input.style.outlineColor = '#6C9BCF';
    input.style.border = '2px solid #6C9BCF'
  });

  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.style.outlineColor = '';
      input.style.border = '';
    }
  });
});