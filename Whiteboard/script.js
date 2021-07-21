"use strict";
window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const colors = document.querySelectorAll(".color");
  const picker = document.querySelector(".color-picker");
  const range = document.querySelector(".range");
  const clear = document.querySelector(".clear");
  const bg = document.querySelector(".background");
  const shapeopt = document.querySelector("shape-btn");
  const shapes = document.querySelector("btn");
  const undo = document.querySelector(".undo");
  const redo = document.querySelector(".redo");
  const erase = document.querySelector(".erase");
  // console.log(colors)
  // -----------------
  //  Cursor Code Start
  // -----------------

  //---------------
  //    Eraser
  //--------------

  const circle = document.querySelector(".circle");

  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseout", linkLeaveHandler);

  canvas.addEventListener("mousedown", mouseStart);
  canvas.addEventListener("mouseup", mouseEnd);

  function mouseMoveHandler(e) {
    circle.style.left = e.clientX - circle.offsetWidth / 2 + "px";
    circle.style.top = e.clientY - circle.offsetHeight / 2 + "px";
    circle.style.opacity = 1;
  }
  function linkLeaveHandler(e) {
    circle.style.opacity = 0;
  }

  function mouseStart(e) {
    circle.style.background = "rgba(194, 194, 194, .80)";
  }
  function mouseEnd(e) {
    circle.style.background = "rgba(194, 194, 194, .25)";
  }

  range.addEventListener("input", (e) => {
    circle.style.width = circle.style.height = `${range.value * 2}px`;
    console.log(range.value);
  });

  //---------------
  //    Pencil
  //--------------

  const pencil = document.querySelector(".pencil");
  canvas.addEventListener("mousemove", pencilMove);
  canvas.addEventListener("mouseout", pencilLeave);

  function pencilMove(e) {
    pencil.style.left = e.clientX + "px";
    pencil.style.top = e.clientY - 20 + "px";
    pencil.style.opacity = 1;
  }

  function pencilLeave(e) {
    pencil.style.opacity = 0;
  }

  const pen_btn = document.querySelector(".pen");

  pen_btn.addEventListener("click", function (e) {
    circle.style.display = "none";
    pencil.style.display = "block";
  });

  erase.addEventListener("click", function (e) {
    pencil.style.display = "none";
    circle.style.display = "block";
  });

  // -----------------
  //  Cursor End
  //-----------------

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  let bgColor = "white";
  let penColor = "black";
  let penWidth = "3";
  let flag = false;

  let undoArray = [];
  let undoIdx = -1;
  let redoArray = [];

  //   const arrayOfTools = [shapesElem];

  //   select.addEventListener("click", () => {
  //     arrayOfTools.forEach((tool) => {
  //       if (!tool.classList.contains("none")) {
  //         tool.classList.add("none");
  //       }
  //     });
  //     console.log("hello");
  //   });
  const changeColor = () => {
    Array.from(colors).forEach((color, i) => {
      color.addEventListener("click", (e) => {
        console.log("color " + i + " clicked");
        console.log(color.style.background);
        pencil.style.fill = penColor =
          i == 0 ? "red" : i == 1 ? "blue" : i == 2 ? "green" : "black";
        console.log("gcua");
      });
    });
  };

  // const changePickerColor = () => {
  //   picker.addEventListener("input", (e) => {
  //     penColor = picker.value;
  //     console.log("ihoih");
  //   });
  // };

  const changeWidth = () => {
    range.addEventListener("input", (e) => {
      penWidth = range.value;
    });
  };

  const clearPage = () => {
    clear.addEventListener("click", (e) => {
      ctx.fillStyle = bgColor;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  };

  const undoCanvas = () => {
    undo.addEventListener("click", (e) => {
      console.log(undoIdx);
      if (undoIdx <= 0) {
        ctx.fillStyle = bgColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        undoArray = [];
        undoIdx = -1;
      } else {
        undoIdx -= 1;
        undoArray.slice(undoIdx, 1);
        ctx.putImageData(undoArray[undoIdx], 0, 0);
      }
    });
  };

  const redoCanvas = () => {
    redo.addEventListener("click", (e) => {
      if (undoIdx + 1 < redoArray.length) {
        undoIdx += 1;
        undoArray.push(redoArray[undoIdx]);
        ctx.putImageData(redoArray[undoIdx], 0, 0);
      }
    });
  };
  const addBgPicker = () => {
    bg.innerHTML = `<div class="bg-box">
          <input type="color" class="bg-picker" />
        </div>`;
    bg.addEventListener("click", (e) => {
      const bgPicker = document.querySelector(".bg-picker");
      bgPicker.addEventListener("input", (e) => {
        bgColor = bgPicker.value;
        canvas.style.background = bgColor;
      });
    });
  };

  // const shapeopts = () => {
  //   shapeopt.addEventListener("click", (e) => {
  //     shapes.style.display = "flex";
  //   });
  // };

  // function makeShapes() {
  //   const rectangle = document.getElementById("Rectangle");
  //   rectangle.addEventListener("click", (e) => {
  //     ctx.strokeRect(
  //       e.clientX - canvas.offsetLeft / 2 - 100,
  //       e.clientY - canvas.offsetTop / 2,
  //       400,
  //       200
  //     );
  //   });
  //   const square = document.getElementById("Square");
  //   square.addEventListener("click", (e) => {
  //     ctx.strokeRect(
  //       e.clientX - canvas.offsetLeft / 2,
  //       e.clientY - canvas.offsetTop / 2,
  //       200,
  //       200
  //     );
  //   });
  //   const circle = document.getElementById("Circle");
  //   circle.addEventListener("click", (e) => {
  //     ctx.beginPath();
  //     ctx.arc(
  //       e.clientX - canvas.offsetLeft / 2 - 50,
  //       e.clientY - canvas.offsetTop / 2,
  //       50,
  //       0,
  //       Math.PI * 2,
  //       false
  //     );
  //     ctx.stroke();
  //     ctx.beginPath();
  //   });
  //   const triangle = document.getElementById("Triangle");
  //   triangle.addEventListener("click", (e) => {
  //     ctx.beginPath();
  //     ctx.moveTo(
  //       e.clientX - canvas.offsetLeft / 2,
  //       e.clientY - canvas.offsetTop / 2
  //     );
  //     ctx.lineTo(
  //       e.clientX - canvas.offsetLeft / 2 - 100,
  //       e.clientY - canvas.offsetTop / 2 - 200
  //     );
  //     ctx.lineTo(
  //       e.clientX - canvas.offsetLeft / 2 - 100,
  //       e.clientY - canvas.offsetTop / 2 - 250
  //     );
  //     ctx.closePath();
  //     ctx.stroke();
  //     ctx.beginPath();
  //   });

  //   const line = document.getElementById("Line");
  //   line.addEventListener("click", (e) => {
  //     ctx.beginPath();
  //     ctx.log(e.target);
  //     ctx.beginPath();
  //     ctx.moveTo(e.clientX, e.clientY);
  //     ctx.lineTo(
  //       e.clientX - canvas.offsetLeft / 2,
  //       e.clientY - canvas.offsetTop / 2
  //     );
  //     ctx.stroke();
  //     ctx.closePath();
  //   });

  //   const ellipse = document.getElementById("shapeEllipse");
  //   ellipse.addEventListener("click", (e) => {
  //     ctx.beginPath();
  //     ctx.ellipse(
  //       e.clientX - canvas.offsetLeft / 2,
  //       e.clientY - canvas.offsetTop / 2,
  //       50,
  //       75,
  //       Math.PI / 2,
  //       0,
  //       2 * Math.PI
  //     );
  //     ctx.stroke();
  //   });
  // }

  // const eraseOnMove = () => {
  //     ctx.fillStyle = bgColor
  //     ctx.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
  //     ctx.fillRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
  //     // context.clearRect(0,0 ,canvas.width, canvas.height);
  //     context.fillRect(0,0 ,canvas.width, canvas.height);
  //     restore_array=[];
  //     index=-1;
  // }

  // const stopErasing = () => {
  // }

  // const erasePage = () => {
  //     erase.addEventListener('click', e => {
  //         canvas.addEventListener('mousedown', eraseOnMove)
  //         canvas.addEventListener('mousemove', eraseOnMove)
  //         canvas.addEventListener('mouseup', stopErasing)
  //     })
  // }

  const eraser = () => {
    erase.addEventListener("click", (e) => {
      pencil.style.fill = penColor;
      penColor = bgColor;
    });
  };

  const pen = () => {
    pen_btn.addEventListener("click", (e) => {
      penColor = pencil.style.fill;
    });
  };

  changeColor();
  // changePickerColor();
  addBgPicker();
  changeWidth();
  clearPage();
  undoCanvas();
  redoCanvas();
  eraser();
  // shapeopts();
  // makeShapes();
  pen();
  //   erasePage();
  //normal drawing
  const start = (e) => {
    flag = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  };

  const end = (e) => {
    if (flag) {
      // ctx.stroke()
      ctx.closePath();
      flag = false;
    }

    if (e.type != "mouseout") {
      undoArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      redoArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      undoIdx += 1;
      console.log(undoArray);
    }
  };

  const draw = (e) => {
    if (!flag) return;
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    ctx.strokeStyle = ctx.fillStyle = penColor;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.lineWidth = penWidth * 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      e.clientX - canvas.offsetLeft,
      e.clientY - canvas.offsetTop,
      penWidth,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  };

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseout", end, false);

  // window.addEventListener("resize", (e) => {
  //   canvas.height = 0.77 * window.innerHeight;
  //   canvas.width = 0.8 * window.innerWidth;
  //   ctx.putImageData(undoArray[undoIdx], 0, 0);
  // });
});
