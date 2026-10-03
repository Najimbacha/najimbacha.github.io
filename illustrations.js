// Deterministic, locally drawn meal illustrations. These are example meals,
// not photographs or live food recognition results.
(() => {
  const host = document.querySelector(".food-art");
  if (!host) return;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 420;
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  host.replaceChildren(canvas);
  host.classList.add("illustrated");

  function circle(x, y, radius, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  function ellipse(x, y, rx, ry, rotation, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
  }
  function leaf(x, y, angle, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size, -size * 0.4, size * 0.65, size * 0.6, 0, size);
    ctx.bezierCurveTo(
      -size * 0.85,
      size * 0.4,
      -size * 0.7,
      -size * 0.5,
      0,
      -size,
    );
    ctx.fill();
    ctx.strokeStyle = "#d1eac64d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(0, size * 0.75);
    ctx.stroke();
    ctx.restore();
  }
  function drawMeal(index) {
    ctx.clearRect(0, 0, 420, 420);
    const rim = ctx.createRadialGradient(180, 150, 60, 210, 210, 188);
    rim.addColorStop(0, "#cbd8dc");
    rim.addColorStop(0.76, "#dce8e9");
    rim.addColorStop(0.87, "#8b9ea7");
    rim.addColorStop(0.94, "#eff7f5");
    rim.addColorStop(1, "#9aaeb7");
    circle(210, 210, 187, rim);
    circle(210, 210, 151, "#394940");
    ctx.save();
    ctx.beginPath();
    ctx.arc(210, 210, 149, 0, Math.PI * 2);
    ctx.clip();

    // Grains and leaves form a textured base, instead of flat placeholder shapes.
    circle(210, 210, 148, index === 2 ? "#3c6142" : "#b8a276");
    for (let i = 0; i < 290; i++) {
      const angle = i * 2.39996;
      const radius = Math.sqrt((i + 0.5) / 290) * 147;
      const x = 210 + Math.cos(angle) * radius;
      const y = 210 + Math.sin(angle) * radius;
      if (index === 2) {
        if (i % 5 === 0)
          leaf(
            x,
            y,
            angle,
            18 + (i % 13),
            ["#548351", "#759b59", "#3c754b"][i % 3],
          );
      } else {
        ellipse(
          x,
          y,
          5.5,
          2.5,
          angle,
          ["#e5d3a8", "#c6b080", "#f2dfb4", "#927953"][i % 4],
        );
      }
    }
    for (let i = 0; i < 12; i++) {
      leaf(
        116 + (i % 3) * 30,
        120 + Math.floor(i / 3) * 36,
        i * 0.7,
        30,
        ["#47734c", "#619553", "#8aa95f"][i % 3],
      );
    }
    if (index === 0) {
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(209 + i * 12, 162 + i * 21);
        ctx.rotate(-0.55);
        ellipse(0, 0, 51, 17, 0, "#426b3e");
        ellipse(0, -3, 47, 14, 0, "#aed177");
        ellipse(0, -5, 34, 9, 0, "#dbe7a0");
        ctx.restore();
      }
    } else if (index === 1) {
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(215 + i * 9, 142 + i * 30);
        ctx.rotate(-0.25);
        const chicken = ctx.createLinearGradient(0, -13, 0, 13);
        chicken.addColorStop(0, "#f4dab0");
        chicken.addColorStop(0.65, "#cf995d");
        chicken.addColorStop(1, "#805237");
        ellipse(0, 0, 53 - i * 2, 15, 0, chicken);
        ctx.strokeStyle = "#885331";
        ctx.lineWidth = 3;
        for (let stripe = -30; stripe < 35; stripe += 18) {
          ctx.beginPath();
          ctx.moveTo(stripe, -8);
          ctx.lineTo(stripe + 8, 8);
          ctx.stroke();
        }
        ctx.restore();
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const x = 210 + Math.cos(i * 1.6) * 67;
        const y = 206 + Math.sin(i * 1.6) * 76;
        circle(x, y, 24, "#669766");
        circle(x, y, 20, "#c8df9a");
        circle(x, y, 11, "#e2edbe");
        for (let seed = 0; seed < 5; seed++)
          ellipse(
            x + Math.cos(seed * 1.256) * 7,
            y + Math.sin(seed * 1.256) * 7,
            3,
            1.5,
            seed,
            "#a5b875",
          );
      }
    }
    for (const [x, y] of [
      [140, 282],
      [175, 300],
      [304, 182],
      [292, 142],
    ]) {
      circle(x + 2, y + 3, 17, "#26332955");
      circle(x, y, 16, "#b74432");
      circle(x - 2, y - 2, 12, "#ec7354");
      circle(x - 4, y - 5, 3, "#ffcb8a");
      ctx.strokeStyle = "#f0ac73";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 9, y);
      ctx.lineTo(x + 9, y);
      ctx.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const angle = i * 2.4;
      circle(
        210 + Math.cos(angle) * ((i * 23) % 119),
        210 + Math.sin(angle) * ((i * 17) % 123),
        2.2,
        "#e5e8ba",
      );
    }
    ctx.restore();
  }
  drawMeal(0);
  document.addEventListener("mealpreviewchange", (event) =>
    drawMeal(event.detail),
  );
})();
