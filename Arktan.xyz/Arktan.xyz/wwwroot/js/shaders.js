// Define a list of shaders
const shaders = [
    {
        name: "Converted ShaderToy",
        fragmentSource: `
        precision mediump float;

        uniform vec2 resolution;
        uniform float time;

        void main() {
            vec3 c;
            float l, z = time;
            vec2 fragCoord = gl_FragCoord.xy;

            for (int i = 0; i < 3; i++) {
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
            }`
        },
    {
        name: "Moving Boxes",
        fragmentSource: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;

        const float REPEAT = 5.0;

        mat2 rot(float a) {
            float c = cos(a), s = sin(a);
            return mat2(c, s, -s, c);
        }

        float sdBox(vec3 p, vec3 b) {
            vec3 q = abs(p) - b;
            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
        }

        float box(vec3 pos, float scale) {
            pos *= scale;
            float base = sdBox(pos, vec3(0.4, 0.4, 0.1)) / 1.5;
            pos.xy *= 5.0;
            pos.y -= 3.5;
            pos.xy *= rot(0.75);
            return -base;
        }

        float box_set(vec3 pos, float gTime) {
            vec3 pos_origin = pos;
            pos.y += sin(gTime * 0.4) * 2.5;
            pos.xy *= rot(0.8);
            float box1 = box(pos, 2.0 - abs(sin(gTime * 0.4)) * 1.5);

            pos = pos_origin;
            pos.y -= sin(gTime * 0.4) * 2.5;
            pos.xy *= rot(0.8);
            float box2 = box(pos, 2.0 - abs(sin(gTime * 0.4)) * 1.5);

            return max(box1, box2);
        }

        float map(vec3 pos, float gTime) {
            return box_set(pos, gTime);
        }

        void main() {
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
            vec3 ro = vec3(0.0, -0.2, time * 4.0);
            vec3 ray = normalize(vec3(p, 1.5));

            ray.xy = ray.xy * rot(sin(time * 0.03) * 5.0);
            ray.yz = ray.yz * rot(sin(time * 0.05) * 0.2);

            float t = 0.1;
            vec3 col = vec3(0.0);
            float ac = 0.0;

            for (int i = 0; i < 99; i++) {
                vec3 pos = ro + ray * t;
                pos = mod(pos - 2.0, 4.0) - 2.0;
                float gTime = time - float(i) * 0.01;

                float d = map(pos, gTime);
                d = max(abs(d), 0.01);
                ac += exp(-d * 23.0);
                t += d * 0.55;
            }

            col = vec3(ac * 0.02);
            gl_FragColor = vec4(col, 1.0);
        }`
    },
    {
        name: "Rotating Fractal",
        fragmentSource: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;

        vec3 palette(float d) {
            return mix(vec3(0.2, 0.7, 0.9), vec3(1.0, 0.0, 1.0), d);
        }

        vec2 rotate(vec2 p, float a) {
            float c = cos(a);
            float s = sin(a);
            return p * mat2(c, s, -s, c);
        }

        float map(vec3 p) {
            for (int i = 0; i < 8; ++i) {
                float t = time * 0.2;
                p.xz = rotate(p.xz, t);
                p.xy = rotate(p.xy, t * 1.89);
                p.xz = abs(p.xz);
                p.xz -= 0.5;
            }
            return dot(sign(p), p) / 5.0;
        }

        vec4 rayMarch(vec3 ro, vec3 rd) {
            float t = 0.0;
            vec3 col = vec3(0.0);
            float d;

            for (float i = 0.0; i < 64.0; i++) {
                vec3 p = ro + rd * t;
                d = map(p) * 0.5;
                if (d < 0.02) break;
                if (d > 100.0) break;
                col += palette(length(p) * 0.1) / (400.0 * d);
                t += d;
            }
            return vec4(col, 1.0 / (d * 100.0));
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - (resolution.xy * 0.5)) / resolution.x;
            vec3 ro = vec3(0.0, 0.0, -50.0);
            ro.xz = rotate(ro.xz, time);

            vec3 cf = normalize(-ro);
            vec3 cs = normalize(cross(cf, vec3(0.0, 1.0, 0.0)));
            vec3 cu = normalize(cross(cf, cs));

            vec3 uuv = ro + cf * 3.0 + uv.x * cs + uv.y * cu;
            vec3 rd = normalize(uuv - ro);

            vec4 col = rayMarch(ro, rd);

            gl_FragColor = col;
        }`
    },
    {
        name: "Abstract Color Swirl",
        fragmentSource: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;

        vec3 palette(float t) {
            vec3 a = vec3(0.5, 0.5, 0.5);
            vec3 b = vec3(0.5, 0.5, 0.5);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.263, 0.416, 0.557);

            return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
            vec2 uv0 = uv;
            vec3 finalColor = vec3(0.0);

            for (float i = 0.0; i < 4.0; i++) {
                uv = mod(uv * 1.5, 1.0) - 0.5;

                float d = length(uv) * exp(-length(uv0));
                vec3 col = palette(length(uv0) + i * 0.4 + time * 0.4);

                d = sin(d * 8.0 + time) / 8.0;
                d = abs(d);
                d = pow(0.01 / d, 1.2);

                finalColor += col * d;
            }

            gl_FragColor = vec4(finalColor, 1.0);
        }`
    },
    {
        name: "Colormap fBM Shader",
        fragmentSource: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;

        float colormap_red(float x) {
            if (x < 0.0) {
                return 54.0 / 255.0;
            } else if (x < 20049.0 / 82979.0) {
                return (829.79 * x + 54.51) / 255.0;
            } else {
                return 1.0;
            }
        }

        float colormap_green(float x) {
            if (x < 20049.0 / 82979.0) {
                return 0.0;
            } else if (x < 327013.0 / 810990.0) {
                return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
            } else if (x <= 1.0) {
                return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
            } else {
                return 1.0;
            }
        }

        float colormap_blue(float x) {
            if (x < 0.0) {
                return 54.0 / 255.0;
            } else if (x < 7249.0 / 82979.0) {
                return (829.79 * x + 54.51) / 255.0;
            } else if (x < 20049.0 / 82979.0) {
                return 127.0 / 255.0;
            } else if (x < 327013.0 / 810990.0) {
                return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
            } else {
                return 1.0;
            }
        }

        vec4 colormap(float x) {
            return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
        }

        float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);

            float res = mix(
                mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
                mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
            return res * res;
        }

        const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

        float fbm(vec2 p) {
            float f = 0.0;
            f += 0.500000 * noise(p + time);
            p = mtx * p * 2.02;
            return f / 0.96875;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.x;
            float shade = fbm(uv);
            gl_FragColor = vec4(colormap(shade).rgb, shade);
        }`
    }
];


// Function to return a random shader
window.getRandomShader = function() {
    return shaders[Math.floor(Math.random() * shaders.length)];
};
