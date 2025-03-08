const canvas = document.getElementById("shaderCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported");
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

// Vertex Shader
const vertexShaderSource = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
`;


const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec2 resolution;
    uniform float time;
    
    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec3 c;
        float l, z; 
        z = time;
    
        for(int i = 0; i < 3; i++) {
            vec2 uv, p = fragCoord / resolution;
            uv = p;
            p -= 0.5;
            p.x *= resolution.x / resolution.y;
            z += 0.07;
            l = length(p);
            uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z - z));
            c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
        }
    
        gl_FragColor = vec4(c / l, 1.0);
    }
`;

function compileShader(source, type) { // type: gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); // Set the source of the shader to the source string
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { // Check if the shader compiled successfully
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader; // Return the compiled shader
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER); // Compile the vertex shader
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER); // Compile the fragment shader

const shaderProgram = gl.createProgram(); // Create a shader program
gl.attachShader(shaderProgram, vertexShader); // Attach the vertex shader to the program
gl.attachShader(shaderProgram, fragmentShader); // Attach the fragment shader to the program
gl.linkProgram(shaderProgram); // Link the program

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Shader linking error:", gl.getProgramInfoLog(shaderProgram)); // Check if the program linked successfully
}

gl.useProgram(shaderProgram); // Use the shader program

const vertices = new Float32Array([ // Define the vertices of the triangle
    -1, -1,
    3, -1,
    -1, 3
]);

const vertexBuffer = gl.createBuffer(); // Create a buffer
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // Set the buffer data

const positionLocation = gl.getAttribLocation(shaderProgram, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); // Set the vertex attributes


function render(time) {
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "time"), time * 0.001);
    gl.uniform2f(gl.getUniformLocation(shaderProgram, "resolution"), canvas.width, canvas.height); // Set the resolution uniform
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
}
requestAnimationFrame(render); // Start the render loop

window.initShader = function() { // Called from Blazor
    console.log("Initializing shader..."); // Log a message
};

window.scrollToBottom = function (element) { // Called from Blazor
    if (element) {
        element.scrollTop = element.scrollHeight; // Scroll to the bottom of the element
    }
};

