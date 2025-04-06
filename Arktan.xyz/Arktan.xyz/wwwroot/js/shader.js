window.currentShader = null;
window.isTransitioning = false;
window.targetOpacity = 1;
window.currentOpacity = 1;
window.gl = null;
window.shaderProgram = null;
window.positionLocation = null;
window.resolutionLocation = null;
window.timeLocation = null;
window.opacityLocation = null;
window.canvas = null;

window.initShader = async function() {
    console.log("Initializing with shader: Rotating Fractal");
    let shaderData = shaders.find(s => s.name === "Rotating Fractal");
    window.currentShader = shaderData;

    window.canvas = document.getElementById("shaderCanvas");
    window.gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `
        attribute vec4 position;
        void main() {
            gl_Position = position;
        }`;

    function compileShader(source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader error:", gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(window.currentShader.fragmentSource, gl.FRAGMENT_SHADER);

    window.shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader linking error:", gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

    const vertices = new Float32Array([
        -1, -1,
        3, -1,
        -1, 3
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    window.positionLocation = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    window.resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
    window.timeLocation = gl.getUniformLocation(shaderProgram, "time");
    window.opacityLocation = gl.getUniformLocation(shaderProgram, "opacity");

    // Start rendering loop
    render();
};

window.setShader = async function(name) {
    if (window.isTransitioning || (window.currentShader && window.currentShader.name === name)) {
        return;
    }

    window.isTransitioning = true;
    window.targetOpacity = 0;

    function fadeOut(callback) {
        window.currentOpacity -= 0.02; // Adjust fade speed
        if (window.currentOpacity <= 0) {
            window.currentOpacity = 0;
            callback();
            return;
        }
        requestAnimationFrame(() => fadeOut(callback));
    }

    fadeOut(async () => {
        const shader = shaders.find(s => s.name === name);
        if (!shader) {
            console.error("Shader not found:", name);
            window.isTransitioning = false;
            return;
        }

        window.currentShader = shader;
        const fragmentShaderSource = shader.fragmentSource;
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        window.resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
        window.timeLocation = gl.getUniformLocation(shaderProgram, "time");
        window.opacityLocation = gl.getUniformLocation(shaderProgram, "opacity");


        window.targetOpacity = 1;
        fadeIn();
    });
};

function fadeIn() {
    window.currentOpacity += 0.02; // Adjust fade speed
    if (window.currentOpacity >= window.targetOpacity) {
        window.currentOpacity = window.targetOpacity;
        window.isTransitioning = false;
        return;
    }
    requestAnimationFrame(fadeIn);
}

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function render(time) {
    if (!window.gl || !window.shaderProgram) return;
    gl.uniform1f(window.timeLocation, time * 0.001);
    gl.uniform2f(window.resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(window.opacityLocation, window.currentOpacity);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
}

// shader.js

window.shakeShark = function() {
    const sharkEmoji = document.getElementById("shark-emoji");
    if (sharkEmoji) {
        sharkEmoji.classList.add("shake");
        setTimeout(() => {
            sharkEmoji.classList.remove("shake");
        }, 500); // Duration of the shake animation
    }
};

window.disableShaders = function() {
    const canvas = document.getElementById("shaderCanvas");
    if (canvas) {
        canvas.style.display = "none";
    }
    const messageElement = document.getElementById("shader-message");
    if (messageElement) {
        messageElement.style.display = "block";
    }
};

window.showShaderMessage = function() {
    const messageElement = document.getElementById("shader-message");
    if (messageElement) {
        messageElement.style.display = "block";
    }
};