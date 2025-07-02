document.addEventListener("DOMContentLoaded", function () {
  const landingScreen = document.getElementById("landingScreen");
  const launchTerminalBtn = document.getElementById("launchTerminalBtn");
  const terminalWindow = document.getElementById("terminalWindow");
  const terminalOutput = document.getElementById("terminalOutput");
  const commandInput = document.getElementById("commandInput");
  const promptUserElem = document.getElementById("promptUser");
  const promptPathElem = document.getElementById("promptPath");
  const currentYearLandingElem = document.getElementById("currentYearLanding");
  const landingLinksContainer = document.getElementById("landingLinks");
  const terminalCloseBtn = document.getElementById("terminalCloseBtn");

  const USERNAME = "idosom";
  const HOSTNAME = "cmd";
  let CURRENT_PATH = "~";

  const commonLinksData = [
    {
      name: "linkedin",
      displayText: "LinkedIn",
      icon: "assets/images/linkedin.png",
      terminalText: "LinkedIn @ Ido Somekh",
      url: "https://www.linkedin.com/in/idosom/",
    },
    {
      name: "github",
      displayText: "GitHub",
      icon: "assets/images/github.png",
      terminalText: "GitHub @ idosom",
      url: "https://github.com/idosom",
    },
    {
      name: "instagram",
      displayText: "Instagram",
      icon: "assets/images/instagram.png",
      terminalText: "Instagram @ ido.png",
      url: "https://www.instagram.com/ido.png",
    },
    {
      name: "last.fm",
      displayText: "Music",
      icon: "assets/images/lastfm.png",
      terminalText: "Last.fm @ idosom",
      url: "https://www.last.fm/user/Idosom",
    },
  ];

  const profileInfo = {
    name: "Ido Somekh",
    title: "Entrepreneur | Developer | Music Enthusiast",
    bio: "Welcome to my terminal. Type 'help' to see available commands.",
    contact: "Find my links using the 'links' or 'ls' command.",
  };

  let commandHistory = [];
  let historyIndex = -1;
  let terminalInitialized = false;

  function setupLandingPage() {
    if (
      !landingScreen ||
      !launchTerminalBtn ||
      !currentYearLandingElem ||
      !landingLinksContainer
    ) {
      console.error(
        "CRITICAL: One or more landing page elements not found. Check IDs."
      );
      return;
    }

    document.body.classList.add("landing-active");
    currentYearLandingElem.textContent = new Date().getFullYear();

    landingLinksContainer.innerHTML = "";
    commonLinksData.forEach((link) => {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      if (link.icon) {
        const img = document.createElement("img");
        img.src = link.icon;
        img.alt = link.displayText;
        anchor.appendChild(img);
      }
      anchor.appendChild(document.createTextNode(link.displayText));
      landingLinksContainer.appendChild(anchor);
    });

    const landingTitle = document.querySelector(".landing-content h1");
    if (landingTitle) landingTitle.textContent = profileInfo.name;
    const landingBio = document.querySelector(".landing-content .landing-bio");
    if (landingBio) landingBio.textContent = profileInfo.title;

    launchTerminalBtn.addEventListener("click", launchTerminal);
  }

  function sanitizeText(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  function displayOutput(content, type = "", isHtml = false) {
    const line = document.createElement("div");
    line.classList.add("output-line");
    if (type) line.classList.add(type);
    if (isHtml) line.innerHTML = content;
    else line.textContent = content;
    terminalOutput.appendChild(line);
    scrollToBottom();
  }

  function displayPromptAndCommand(commandStr) {
    const sanitizedCommand = sanitizeText(commandStr);
    const promptHtml =
      `<span class="prompt-user">${USERNAME}@${HOSTNAME}</span>` +
      `:<span class="prompt-path">${CURRENT_PATH}</span>` +
      `<span class="prompt-symbol">$</span> ${sanitizedCommand}`;
    displayOutput(promptHtml, "command-echo", true);
  }

  function scrollToBottom() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function clearInput() {
    commandInput.value = "";
  }

  function executeCommand(commandStr) {
    displayPromptAndCommand(commandStr);
    if (commandStr.trim() === "") return;
    commandHistory.push(commandStr);
    historyIndex = commandHistory.length;
    const [command, ...args] = commandStr.trim().split(/\s+/);

    switch (command.toLowerCase()) {
      case "help":
        const helpText =
          `Available commands:<br>` +
          `  help             - Show this help message<br>` +
          `  whoami           - Display user information<br>` +
          `  links / ls       - List available links<br>` +
          `  open [link_name] - Open a specific link (e.g., 'open github')<br>` +
          `  date             - Show current date and time<br>` +
          `  echo [message]   - Display a line of text<br>` +
          `  clear / cls      - Clear the terminal screen<br>` +
          `  motd             - Display the message of the day<br>` +
          `  exit             - Close the terminal<br>` +
          `  neofetch         - The classic<br>`;
        displayOutput(helpText, "", true);
        break;
      case "whoami":
        const whoamiOutput =
          `User: ${profileInfo.name} (${USERNAME})<br>` +
          `Title: ${sanitizeText(profileInfo.title)}<br>` +
          `${sanitizeText(profileInfo.contact)}`;
        displayOutput(whoamiOutput, "", true);
        break;
      case "links":
      case "ls":
        if (commonLinksData.length === 0) {
          displayOutput("No links configured.", "warning");
          break;
        }
        let linksHtml = "Available links:<br>";
        commonLinksData.forEach((link) => {
          linksHtml += `<span class="link-item-output">`;
          linksHtml += `<a href="${sanitizeText(
            link.url
          )}" target="_blank">${sanitizeText(
            link.terminalText || link.displayText
          )}</a></span>`;
        });
        displayOutput(linksHtml, "", true);
        break;
      case "neofetch":
        const neofetchOutput =
          `<span class="ctp-mauve">OS:</span> I use Arch BTW<br>` +
          `<span class="ctp-blue">Uptime:</span> 22 minutes<br>` +
          `<span class="ctp-green">CPU:</span> Ryzen 7 9700x<br>` +
          `<span class="ctp-yellow">GPU:</span> RTX 3080<br>` +
          `<span class="ctp-peach">Resolution:</span> 2560x1440<br>` +
          `<span class="ctp-pink">WM:</span> Hyprland<br>` +
          `<span class="ctp-red">Terminal:</span> kitty`;
        displayOutput(neofetchOutput, "", true);
        break;
      case "open":
        if (args.length === 0) {
          displayOutput(
            "Usage: open [link_name]<br>Example: open github",
            "error",
            true
          );
          break;
        }
        const linkNameToOpen = args[0].toLowerCase();
        const linkToOpen = commonLinksData.find(
          (l) => l.name.toLowerCase() === linkNameToOpen
        );
        if (linkToOpen) {
          displayOutput(
            `Opening ${sanitizeText(
              linkToOpen.terminalText || linkToOpen.displayText
            )}...`,
            "success"
          );
          window.open(linkToOpen.url, "_blank");
        } else {
          displayOutput(
            `Link '${sanitizeText(
              linkNameToOpen
            )}' not found. Type 'links' to see available links.`,
            "error"
          );
        }
        break;
      case "date":
        displayOutput(new Date().toString());
        break;
      case "echo":
        displayOutput(args.join(" "));
        break;
      case "clear":
      case "cls":
        terminalOutput.innerHTML = "";
        break;
      case "motd":
        welcomeMessage();
        break;
      case "exit":
        closeTerminal();
        break;
      case "repo":
        displayOutput("Repository link not configured.", "warning");
        break;
      default:
        displayOutput(
          `command not found: ${sanitizeText(command)}. Type 'help' or 'exit'.`,
          "error"
        );
    }
  }

  function initializeTerminal() {
    if (terminalInitialized) {
      commandInput.focus();
      return;
    }
    if (
      !commandInput ||
      !terminalWindow ||
      !promptUserElem ||
      !promptPathElem ||
      !terminalCloseBtn
    ) {
      console.error(
        "CRITICAL: One or more terminal elements not found during initialization. Check IDs."
      );
      return;
    }

    promptUserElem.textContent = USERNAME + "@" + HOSTNAME;
    promptPathElem.textContent = CURRENT_PATH;

    commandInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const commandStr = commandInput.value;
        executeCommand(commandStr);
        clearInput();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          commandInput.value = commandHistory[historyIndex];
          commandInput.setSelectionRange(
            commandInput.value.length,
            commandInput.value.length
          );
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (
          commandHistory.length > 0 &&
          historyIndex < commandHistory.length - 1
        ) {
          historyIndex++;
          commandInput.value = commandHistory[historyIndex];
          commandInput.setSelectionRange(
            commandInput.value.length,
            commandInput.value.length
          );
        } else if (historyIndex === commandHistory.length - 1) {
          historyIndex++;
          clearInput();
        }
      }
    });

    terminalWindow.addEventListener("click", function (event) {
      if (
        event.target !== terminalCloseBtn &&
        terminalCloseBtn &&
        !terminalCloseBtn.contains(event.target)
      ) {
        commandInput.focus();
      }
    });

    terminalCloseBtn.addEventListener("click", closeTerminal);

    welcomeMessage();
    commandInput.focus();
    terminalInitialized = true;
  }

  function welcomeMessage() {
    displayOutput(`Terminal :: ${sanitizeText(profileInfo.name)}`, "info");
    displayOutput(`Type 'help' for a list of commands.`, "info");
    displayOutput(sanitizeText(profileInfo.bio));
    displayOutput(
      `Current time: ${new Date().toLocaleTimeString()}<br>`,
      "subtext0",
      true
    );
  }

  function launchTerminal() {
    if (!landingScreen || !terminalWindow) {
      console.error(
        "CRITICAL: Cannot launch terminal - landingScreen or terminalWindow element missing."
      );
      return;
    }
    landingScreen.classList.add("fade-out");
    document.body.classList.remove("landing-active");

    terminalWindow.classList.remove("hidden");

    void terminalWindow.offsetWidth;
    setTimeout(() => {
      terminalWindow.classList.add("visible");
    }, 0);

    setTimeout(() => {
      initializeTerminal();
    }, 222);
  }

  function closeTerminal() {
    if (!terminalWindow || !landingScreen) {
      console.error(
        "CRITICAL: Cannot close terminal - terminalWindow or landingScreen element missing."
      );
      return;
    }
    terminalWindow.classList.remove("visible");

    setTimeout(() => {
      terminalWindow.classList.add("hidden");
    }, 222);

    landingScreen.classList.remove("fade-out");
    document.body.classList.add("landing-active");
  }

  setupLandingPage();
});
const logoElem = document.getElementById("logo");
const logoImages = [
  "assets/images/ME_AT_14.jpg",
  "assets/images/logo.jpg",
  "assets/images/PLANE.jpg",
  "assets/images/BIKER.jpg",
  "assets/images/IGO.jpg",
];
let logoIndex = 0;

if (logoElem) {
  setInterval(() => {
    logoElem.style.opacity = "0.5";
    logoElem.style.transform = `scale(${1 + Math.random() * 0.4}) rotate(${
      Math.random() * 10 - 5
    }deg)`;
    logoElem.style.filter = "blur(2px)";

    setTimeout(() => {
      logoElem.src = logoImages[logoIndex % logoImages.length];
      logoElem.style.opacity = "1";
      logoElem.style.transform = "scale(1) rotate(0deg)";
      logoElem.style.filter = "blur(0)";
      logoIndex++;
    }, 66);
  }, 222);
}

function toggleNavbar() {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("show");
}

window.addEventListener("load", () => {
  const canvas = document.querySelector(".background-canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gl.viewport(0, 0, width, height);
  }
  window.addEventListener("resize", resizeCanvas);

  let mouse = { x: width / 2, y: height / 2 };
  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  window.addEventListener("mousemove", onMouseMove);

  const circleColors = [
    [147 / 255, 112 / 255, 219 / 255],
    [186 / 255, 135 / 255, 189 / 255],
    [160 / 255, 160 / 255, 200 / 255],
    [180 / 255, 150 / 255, 170 / 255],
    [140 / 255, 120 / 255, 180 / 255],
    [120 / 255, 90 / 255, 160 / 255],
  ];

  let circles = [];
  function initCircles() {
    circles = [];
    const baseRadius = (width + height) * 0.2;
    for (let i = 0; i < 5; i++) {
      const radius = baseRadius;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const speedMultiplier = Math.random() * 4 + 6.88;
      const vx = (Math.random() - 0.5) * speedMultiplier;
      const vy = (Math.random() - 0.35) * speedMultiplier;
      circles.push({
        x,
        y,
        radius,
        color: circleColors[i],
        vx,
        vy,
        interactive: false,
      });
    }

    const interactiveRadius = (width + height) * 0.1;
    circles.push({
      x: width / 2,
      y: height / 2,
      radius: interactiveRadius,
      color: circleColors[5],
      vx: 0,
      vy: 0,
      interactive: true,
    });
  }

  initCircles();

  const vertexSrc = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(void) {
      v_uv = a_position * 0.5 + 0.5; 
      v_uv.y = 1.0 - v_uv.y; 
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
precision mediump float;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform bool u_darkMode;
uniform int u_circleCount;
uniform vec3 u_circlesColor[6];
uniform vec3 u_circlesPosRad[6];
uniform vec2 u_mouse;

void main(void) {
    vec2 st = v_uv * u_resolution;

    vec3 topColor = vec3(108.0/255.0, 0.0, 162.0/255.0);
    vec3 bottomColor = vec3(0.0, 17.0/255.0, 82.0/255.0);
    vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

    float fieldSum = 0.0;
    vec3 weightedColorSum = vec3(0.0);

    for (int i = 0; i < 6; i++) {
        if (i >= u_circleCount) { break; }
        vec3 posRad = u_circlesPosRad[i];
        vec2 cPos = vec2(posRad.r, posRad.g);
        float radius = posRad.b;
        float dist = length(st - cPos);
        float sigma = radius * 0.5;
        float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
        fieldSum += val;
        weightedColorSum += u_circlesColor[i] * val;
    }

    vec3 finalCirclesColor = vec3(0.0);
    if (fieldSum > 0.0) {
      finalCirclesColor = weightedColorSum / fieldSum;
    }

    float intensity = pow(fieldSum, 1.4);
    vec3 finalColor = mix(bgColor, finalCirclesColor, clamp(intensity, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, 1.0);
}
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertShader = createShader(gl.VERTEX_SHADER, vertexSrc);
  const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  const u_resolution = gl.getUniformLocation(program, "u_resolution");
  const u_darkMode = gl.getUniformLocation(program, "u_darkMode");
  const u_circleCount = gl.getUniformLocation(program, "u_circleCount");
  const u_circlesColor = gl.getUniformLocation(program, "u_circlesColor");
  const u_circlesPosRad = gl.getUniformLocation(program, "u_circlesPosRad");
  const u_mouse = gl.getUniformLocation(program, "u_mouse");

  gl.uniform2f(u_resolution, width, height);

  function updateCircles() {
    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      if (!c.interactive) {
        c.x += c.vx;
        c.y += c.vy;
        if (c.x - c.radius > width) c.x = -c.radius;
        if (c.x + c.radius < 0) c.x = width + c.radius;
        if (c.y - c.radius > height) c.y = -c.radius;
        if (c.y + c.radius < 0) c.y = height + c.radius;
      } else {
        c.x += (mouse.x - c.x) * 0.1;
        c.y += (mouse.y - c.y) * 0.1;
      }
    }
  }

  function render() {
    updateCircles();

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform1i(u_circleCount, circles.length);
    gl.uniform2f(u_resolution, width, height);
    gl.uniform2f(u_mouse, mouse.x, mouse.y);

    let colorsArr = [];
    let posRadArr = [];
    for (let i = 0; i < 6; i++) {
      if (i < circles.length) {
        const c = circles[i];
        colorsArr.push(c.color[0], c.color[1], c.color[2]);
        posRadArr.push(c.x, c.y, c.radius);
      } else {
        colorsArr.push(0, 0, 0);
        posRadArr.push(0, 0, 0);
      }
    }

    gl.uniform3fv(u_circlesColor, new Float32Array(colorsArr));
    gl.uniform3fv(u_circlesPosRad, new Float32Array(posRadArr));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
});

const hamburger = document.querySelector(".ham3");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  if (hamburger.classList.contains("active")) {
    navMenu.classList.add("open");
  } else {
    navMenu.classList.remove("open");
  }
});
