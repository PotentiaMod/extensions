
"use strict";
class MathPlus {
    /**
     * Converts a value from radians to degrees.
     * @param {number} value - The value in radians.
     * @returns {number} The value in degrees.
     */
    static toDegrees(value) {
        return value * 180 / Math.PI;
    };

    /**
     * Converts a value from degrees to radians.
     * @param {number} value - The value in degrees.
     * @returns {number} The value in radians.
     */
    static toRadians(value) {
        return value * Math.PI / 180;
    };

    /**
     * Calculates the sine of an angle given in degrees.
     * @param {number} value - The angle in degrees.
     * @returns {number} The sine of the angle.
     */
    static sin(value) {
        return Math.sin(this.toRadians(value));
    };

    /**
     * Calculates the cosine of an angle given in degrees.
     * @param {number} value - The angle in degrees.
     * @returns {number} The cosine of the angle.
     */
    static cos(value) {
        return Math.cos(this.toRadians(value));
    };

    /**
     * Calculates the atans of (x, y) and return degrees.
     * @param {number} y The y of point
     * @param {number} x The x of point
     */
    static atan2(y, x) {
        return MathPlus.toDegrees(Math.atan2(y, x));
    }

    /**
     * Clamps a value between a minimum and maximum boundary.
     * @param {number} min - The minimum boundary.
     * @param {number} value - The value to clamp.
     * @param {number} max - The maximum boundary.
     * @returns {number} The clamped value.
     */
    static between(min, value, max) {
        return Math.max(min, Math.min(max, value));
    };

    /**
     * Generates a random integer between min (inclusive) and max (exclusive).
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (exclusive).
     * @returns {number} A random integer.
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    /**
     * Calculates the Euclidean distance between two 2D points.
     * @param {number} x1 - The x-coordinate of the first point.
     * @param {number} y1 - The y-coordinate of the first point.
     * @param {number} x2 - The x-coordinate of the second point.
     * @param {number} y2 - The y-coordinate of the second point.
     * @returns {number} The distance between the two points.
     */
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    /**
     * Returns the largest number from a list of numbers.
     * @param {...number} number - A list of numbers to evaluate.
     * @returns {number} The maximum value.
     */
    static max(...number) {
        return number.reduce((max, cur) => Math.max(max, cur), -Infinity);
    };

    /**
     * Returns the smallest number from a list of numbers.
     * @param {...number} number - A list of numbers to evaluate.
     * @returns {number} The minimum value.
     */
    static min(...number) {
        return number.reduce((min, cur) => Math.min(min, cur), Infinity);
    };

    static precise(number, precise) {
        return Math.round(number * Math.pow(10, precise)) / Math.pow(10, precise);
    }

    static Matrix = class {
        /**
         * Applies horizontal translation to an x-coordinate.
         * @param {number} x - The original x-coordinate.
         * @param {number} offsetX - The horizontal offset.
         * @returns {number} The translated x-coordinate.
         */
        static translationX(x, offsetX) {
            return x + offsetX;
        }

        /**
         * Applies vertical translation to a y-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} offsetY - The vertical offset.
         * @returns {number} The translated y-coordinate.
         */
        static translationY(y, offsetY) {
            return y + offsetY;
        }

        /**
         * Scales an x-coordinate by a given factor.
         * @param {number} x - The original x-coordinate.
         * @param {number} scale - The scale factor.
         * @returns {number} The scaled x-coordinate.
         */
        static scaleX(x, scale) {
            return x * scale;
        }

        /**
         * Scales a y-coordinate by a given factor.
         * @param {number} y - The original y-coordinate.
         * @param {number} scale - The scale factor.
         * @returns {number} The scaled y-coordinate.
         */
        static scaleY(y, scale) {
            return y * scale;
        }

        /**
         * Rotates an x-coordinate around the origin.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {number} The rotated x-coordinate.
         */
        static rotateX(x, y, rotate) {
            return x * MathPlus.cos(rotate) - y * MathPlus.sin(rotate);
        }

        /**
         * Rotates a y-coordinate around the origin.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {number} The rotated y-coordinate.
         */
        static rotateY(x, y, rotate) {
            return x * MathPlus.sin(rotate) + y * MathPlus.cos(rotate);
        }

        /**
         * Applies a complete 2D transformation: scale, rotate, and translate.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} offsetX - The horizontal translation offset.
         * @param {number} offsetY - The vertical translation offset.
         * @param {number} scale - The uniform scale factor.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {[number, number]} An array containing the transformed [x, y] coordinates.
         */
        static translate(x, y, offsetX, offsetY, scale, rotate) {
            const scaledX = this.scaleX(x, scale);
            const scaledY = this.scaleY(y, scale);

            const rotatedX = this.rotateX(scaledX, scaledY, rotate);
            const rotatedY = this.rotateY(scaledX, scaledY, rotate);

            const finalX = this.translationX(rotatedX, offsetX);
            const finalY = this.translationY(rotatedY, offsetY);

            return [finalX, finalY];
        }

        /**
         * Inverts the complete 2D transformation applied by translate.
         * @param {number} x - The transformed x-coordinate.
         * @param {number} y - The transformed y-coordinate.
         * @param {number} offsetX - The horizontal translation offset used by the forward transform.
         * @param {number} offsetY - The vertical translation offset used by the forward transform.
         * @param {number} scale - The uniform scale factor used by the forward transform.
         * @param {number} rotate - The rotation angle used by the forward transform.
         * @returns {[number, number]} An array containing the original [x, y] coordinates.
         */
        static inverseTranslate(x, y, offsetX, offsetY, scale, rotate) {
            if (scale === 0) return [x - offsetX, y - offsetY];

            const translatedX = x - offsetX;
            const translatedY = y - offsetY;
            const scaledX = translatedX / scale;
            const scaledY = translatedY / scale;

            const rotatedX = this.rotateX(scaledX, scaledY, -rotate);
            const rotatedY = this.rotateY(scaledX, scaledY, -rotate);

            return [rotatedX, rotatedY];
        }
    };
}

class Triangle {
    /**
     * @typedef {[[number, number], [number, number], [number, number]]} triangle
     * @type {triangle}
     */
    #vertexes = [[0, 0], [0, 0], [0, 0]];
    /**@type {triangle} */
    #vertexes_real = [[0, 0], [0, 0], [0, 0]];

    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    get vertexes() {
        return this.#vertexes_real;
    }

    constructor(x1, y1, x2, y2, x3, y3) {
        this.#vertexes = [[x1, y1], [x2, y2], [x3, y3]];
        this.#vertexes_real = this.#vertexes;

        this.#boundingAABB();
    }

    #boundingAABB() {
        const vertexes = this.#vertexes_real;
        this.#bounding.left = MathPlus.precise(Math.min(vertexes[0][0], vertexes[1][0], vertexes[2][0]), 2);
        this.#bounding.right = MathPlus.precise(Math.max(vertexes[0][0], vertexes[1][0], vertexes[2][0]), 2);
        this.#bounding.bottom = MathPlus.precise(Math.min(vertexes[0][1], vertexes[1][1], vertexes[2][1]), 2);
        this.#bounding.top = MathPlus.precise(Math.max(vertexes[0][1], vertexes[1][1], vertexes[2][1]), 2);
    }

    /**
     * AABB collision detection
     * @param {Triangle} triangle Another triangle
     */
    AABB(triangle) {
        const v1 = this.#vertexes_real;
        const v2 = triangle.vertexes;

        /* current triangle */
        const min1X = Math.min(v1[0][0], v1[1][0], v1[2][0]);
        const max1X = Math.max(v1[0][0], v1[1][0], v1[2][0]);
        const min1Y = Math.min(v1[0][1], v1[1][1], v1[2][1]);
        const max1Y = Math.max(v1[0][1], v1[1][1], v1[2][1]);

        /* target triangle */
        const min2X = Math.min(v2[0][0], v2[1][0], v2[2][0]);
        const max2X = Math.max(v2[0][0], v2[1][0], v2[2][0]);
        const min2Y = Math.min(v2[0][1], v2[1][1], v2[2][1]);
        const max2Y = Math.max(v2[0][1], v2[1][1], v2[2][1]);

        return !(max1X < min2X || min1X > max2X || max1Y < min2Y || min1Y > max2Y);

    }

    /**
     * SAT collision detection
     * @param {Triangle} triangle Another triangle
     * @param {boolean} [aabb=true] 
     */
    SAT(triangle, aabb = true) {
        if (aabb && !this.AABB(triangle)) return false;

        const axes = [];
        
        for (let i = 0; i < 3; i++) {
            const p1 = this.#vertexes_real[i];
            const p2 = this.#vertexes_real[(i + 1) % 3];
            const edge = [p2[0] - p1[0], p2[1] - p1[1]];

            const normal = [-edge[1], edge[0]];
            axes.push(normal);
        }
        
        for (let i = 0; i < 3; i++) {
            const p1 = triangle.vertexes[i];
            const p2 = triangle.vertexes[(i + 1) % 3];
            const edge = [p2[0] - p1[0], p2[1] - p1[1]];

            const normal = [-edge[1], edge[0]];
            axes.push(normal);
        }
        
        for (const axis of axes) {
            const length = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1]);
            if (length === 0) continue;
            const normalizedAxis = [axis[0] / length, axis[1] / length];
            
            let min1 = Infinity, max1 = -Infinity;
            for (const point of this.#vertexes_real) {
                const projection = point[0] * normalizedAxis[0] + point[1] * normalizedAxis[1];
                min1 = Math.min(min1, projection);
                max1 = Math.max(max1, projection);
            }
            
            let min2 = Infinity, max2 = -Infinity;
            for (const point of triangle.vertexes) {
                const projection = point[0] * normalizedAxis[0] + point[1] * normalizedAxis[1];
                min2 = Math.min(min2, projection);
                max2 = Math.max(max2, projection);
            }
            
            if (max1 < min2 || max2 < min1) {
                return false;
            }
        }
        
        return true;
    }

    get bounding() {
        return this.#bounding;
    }   

    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        this.#vertexes_real = [
            MathPlus.Matrix.translate(this.#vertexes[0][0], this.#vertexes[0][1], offsetX, offsetY, scale, rotate),
            MathPlus.Matrix.translate(this.#vertexes[1][0], this.#vertexes[1][1], offsetX, offsetY, scale, rotate),
            MathPlus.Matrix.translate(this.#vertexes[2][0], this.#vertexes[2][1], offsetX, offsetY, scale, rotate),
        ];

        if (followCam) {
            this.#vertexes_real = [
                MathPlus.Matrix.translate(this.#vertexes_real[0][0], this.#vertexes_real[0][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
                MathPlus.Matrix.translate(this.#vertexes_real[1][0], this.#vertexes_real[1][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
                MathPlus.Matrix.translate(this.#vertexes_real[2][0], this.#vertexes_real[2][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
            ];
        }

        this.#boundingAABB();
        return this;
    }

    toString() {
        return "Triangle Object";
    }
};

class Polygon {
    /**@type {Triangle[]} */
    #triangles = [];
    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    #offsetX = 0;
    #offsetY = 0;
    #scale = 1;
    #rotate = 0;
    #followCam = false;
    #cameraX = 0;
    #cameraY = 0;
    #cameraScale = 1;
    #cameraRotate = 0;

    /**
     * @constructor
     * @param  {...Triangle} triangle Triangles
     */
    constructor(...triangle) {
        this.#triangles = triangle;
        
    }

    /**
     * Collision detection
     * @param {Polygon} polygon Another polygon
     */
    collision(polygon, aabb = true) {
        for (const tri1 of this.#triangles) {
            for (const tri2 of polygon.triangles) {
                if (tri1.SAT(tri2, aabb)) return true;
            }
        }

        return false;
    }

    append(triangle) {
        this.#triangles.push(triangle.translate(this.#offsetX, this.#offsetY, this.#scale, this.#rotate, this.#followCam, this.#cameraX, this.#cameraY, this.#cameraScale, this.#cameraRotate));
        this.#boundingAABB();
        return this;
    }

    #boundingAABB() {
        if (this.#triangles.length < 1) return;

        const myBounding = this.#bounding;
        myBounding.left = Infinity;
        myBounding.right = -Infinity;
        myBounding.bottom = Infinity;
        myBounding.top = -Infinity;

        for (let index = 0; index < this.#triangles.length; index++) {
            const triBounding = this.#triangles[index].bounding;
            myBounding.left = Math.min(triBounding.left, myBounding.left);
            myBounding.right = Math.max(triBounding.right, myBounding.right);
            myBounding.bottom = Math.min(triBounding.bottom, myBounding.bottom);
            myBounding.top = Math.max(triBounding.top, myBounding.top);
        }
    }

    get triangles() {
        return this.#triangles;
    }

    get bounding() {
        return this.#bounding;
    }

    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        if (
            offsetX === this.#offsetX &&
            offsetY === this.#offsetY &&
            scale === this.#scale &&
            rotate === this.#rotate &&
            followCam === this.#followCam &&
            cameraX === this.#cameraX &&
            cameraY === this.#cameraY &&
            cameraScale === this.#cameraScale &&
            cameraRotate === this.#cameraRotate
        ) return this;
        this.#triangles = this.#triangles.map(tri => tri.translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate));
        this.#offsetX = offsetX;
        this.#offsetY = offsetY;
        this.#scale = scale;
        this.#rotate = rotate;
        this.#followCam = followCam;
        this.#cameraX = cameraX;
        this.#cameraY = cameraY;
        this.#cameraScale = cameraScale;
        this.#cameraRotate = cameraRotate;
        this.#boundingAABB();
        return this;
    }

    toString() {
        return "Polygon Object";
    }
};

class Hitbox {
    /**
     * Create a Polygon with 2 Triangles to be a rectangle.
     * @param {number} x The x in the upper left corner.
     * @param {number} y The y in the upper left corner.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @returns {Polygon}
     */
    static rectangle(x, y, w, h) {
        return new Polygon(
            new Triangle(
                x, y,
                x + w, y,
                x, y - h
            ),
            new Triangle(
                x + w, y,
                x, y - h, 
                x + w, y - h
            )
        );
    }

    /**
     * Create a Hitbox with 2 Triangles to be a rectangle.
     * @param {number} x The x in the upper left corner.
     * @param {number} y The y in the upper left corner.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @returns {Hitbox}
     */
    static rectBox(x, y, w, h) {
        return new Hitbox(this.rectangle(x, y, w, h));
    }

    /** @type {{[name: string]: Polygon}} */
    #boxes = {};
    /**
     * @param {Polygon} defaultHitbox default hitbox
     */
    constructor(defaultHitbox) {
        if (!defaultHitbox) throw new TypeError("Must declare the default polygon for hitbox.");
        this.setBox("default", defaultHitbox);
    }

    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    #offsetX = 0;
    #offsetY = 0;
    #scale = 1;
    #rotate = 0;
    #followCam = false;
    #cameraX = 0;
    #cameraY = 0;
    #cameraScale = 1;
    #cameraRotate = 0;

    /**
     * Set a hitbox by name.
     * @param {string} name The name of the hitbox
     * @param {Polygon} polygon The polygon box
     * @returns {this}
     */
    setBox(name, polygon) {
        this.#boxes[name] = polygon.translate(this.#offsetX, this.#offsetY, this.#scale, this.#rotate, this.#followCam, this.#cameraX, this.#cameraY, this.#cameraScale, this.#cameraRotate);
        this.#boundingAABB();
        return this;
    }

    /**
     * Get a hitbox by name.
     * @param {string} name The name of the hitbox.
     * @returns {Polygon}
     */
    getBox(name) {
        return this.#boxes[name] ?? this.#boxes["default"];
    }

    /**
     * Check this hitbox has the polygon box with the given name.
     * @param {string} name The name of hitbox
     * @returns {boolean}
     */
    hasBox(name) {
        return Object.hasOwn(this.#boxes, name);
    }

    deleteBox(name) {
        if (name === "default") throw new TypeError("Cannot delete the default hitbox.");
        delete this.#boxes[name];
        this.#boundingAABB();
    }

    /**
     * Determine if two collision boxes intersect.
     * @param {string} myType The name of hitbox
     * @param {Hitbox} targetHitbox target hitbox
     * @param {string} targetType target name of hitbox
     * @returns {boolean}
     */
    collision(myType, targetHitbox, targetType, aabb = true) {
        return this.getBox(myType).collision(targetHitbox.getBox(targetType), aabb);
    }

    /**
     * Translate the polygons that belong to this hitbox.
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @param {number} scale 
     * @param {number} rotate 
     */
    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        if (
            offsetX === this.#offsetX &&
            offsetY === this.#offsetY &&
            scale === this.#scale &&
            rotate === this.#rotate &&
            followCam === this.#followCam &&
            cameraX === this.#cameraX &&
            cameraY === this.#cameraY &&
            cameraScale === this.#cameraScale &&
            cameraRotate === this.#cameraRotate
        ) return;
        for (const [key, polygon] of Object.entries(this.#boxes)) {
            this.#boxes[key] = polygon.translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate);
        }
        this.#boundingAABB();
        this.#offsetX = offsetX;
        this.#offsetY = offsetY;
        this.#scale = scale;
        this.#rotate = rotate;
        this.#followCam = followCam;
        this.#cameraX = cameraX;
        this.#cameraY = cameraY;
        this.#cameraScale = cameraScale;
        this.#cameraRotate = cameraRotate;
    }

    #boundingAABB() {
        const polygons = Object.values(this.#boxes);
        if (polygons.length < 1) return;
        const myBounding = this.#bounding;
        myBounding.left = Infinity;
        myBounding.right = -Infinity;
        myBounding.bottom = Infinity;
        myBounding.top = -Infinity;

        for (let index = 0; index < polygons.length; index++) {
            const bounding = polygons[index].bounding;
            myBounding.left = Math.min(bounding.left, myBounding.left);
            myBounding.right = Math.max(bounding.right, myBounding.right);
            myBounding.bottom = Math.min(bounding.bottom, myBounding.bottom);
            myBounding.top = Math.max(bounding.top, myBounding.top);
        }
    }

    get boxes() {
        return Object.keys(this.#boxes);
    }

    get bounding() {
        return this.#bounding;
    }

    toString() {
        return "Hitbox Object";
    }
}

class SAPCollision {
    /**
     * @typedef {{value: number, isMin: boolean, parent: string}} Point
     * @typedef {[Point, Point, Point, Point]} EntityPoints
     */

    /** @type {Point[]} */
    #x_sort = [];
    /** @type {Point[]} */
    #y_sort = [];
    
    /** @type {Map<string, EntityPoints>} */
    #entities = new Map();
    
    /** 
     * @type {Map<string, string[]>} 
     */
    #collisionPairs = new Map();

    constructor() {}

    /**
     * Add a new Entity
     * @param {string} id 
     * @param {number} minX 
     * @param {number} minY 
     * @param {number} maxX 
     * @param {number} maxY 
     */
    addEntity(id, minX, minY, maxX, maxY) {
        if (this.#entities.has(id)) {
            this.moveEntity(id, minX, minY, maxX, maxY);
            return;
        }
        const point_minX = { value: minX, isMin: true, parent: id };
        const point_minY = { value: minY, isMin: true, parent: id };
        const point_maxX = { value: maxX, isMin: false, parent: id };
        const point_maxY = { value: maxY, isMin: false, parent: id };

        this.#entities.set(id, [point_minX, point_minY, point_maxX, point_maxY]);
        this.#collisionPairs.set(id, []);
        
        this.#x_sort.push(point_minX, point_maxX);
        this.#y_sort.push(point_minY, point_maxY);
    }

    moveEntity(id, minX, minY, maxX, maxY) {
        const entity = this.#entities.get(id);
        if (!entity) return;
        entity[0].value = minX;
        entity[1].value = minY;
        entity[2].value = maxX;
        entity[3].value = maxY;
    }

    removeEntity(id) {
        const entity = this.#entities.get(id);
        if (!entity) return;

        this.#x_sort = this.#x_sort.filter(p => p.parent !== id);
        this.#y_sort = this.#y_sort.filter(p => p.parent !== id);
        
        this.#entities.delete(id);
        this.#collisionPairs.delete(id);
    }

    /**
     * True if id1 touch id2 or false.
     * @param {string} id1 
     * @param {string} id2 
     * @returns {boolean}
     */
    touch(id1, id2) {
        return Boolean(this.#collisionPairs.get(id1)?.includes(id2));
    }

    /**
     * Obtain all potential collision bodies.
     * @param {string} id 
     * @returns {string[]}
     */
    getPotentialCollisions(id) {
        return this.#collisionPairs.get(id) ?? [];
    }

    update() {
        this.#x_sort.sort((a, b) => a.value - b.value);
        this.#y_sort.sort((a, b) => a.value - b.value);

        for (const list of this.#collisionPairs.values()) {
            list.length = 0;
        }

        /** @type {Set<string>} */
        const xActive = new Set();
        /** @type {Map<string, Set<string>>} */
        const xOverlaps = new Map(); // X轴重叠关系

        for (const point of this.#x_sort) {
            if (point.isMin) {
                // 当前实体与所有活跃实体在X轴重叠
                for (const activeId of xActive) {
                    if (!xOverlaps.has(point.parent)) xOverlaps.set(point.parent, new Set());
                    if (!xOverlaps.has(activeId)) xOverlaps.set(activeId, new Set());
                    
                    xOverlaps.get(point.parent).add(activeId);
                    xOverlaps.get(activeId).add(point.parent);
                }
                xActive.add(point.parent);
            } else {
                xActive.delete(point.parent);
            }
        }

        /** @type {Set<string>} */
        const yActive = new Set();

        for (const point of this.#y_sort) {
            if (point.isMin) {
                const currentId = point.parent;
                const currentXOverlaps = xOverlaps.get(currentId);

                if (currentXOverlaps) {
                    const pairList = this.#collisionPairs.get(currentId);
                    for (const activeId of yActive) {
                        if (currentXOverlaps.has(activeId)) {
                            pairList.push(activeId);
                            this.#collisionPairs.get(activeId).push(currentId);
                        }
                    }
                }
                yActive.add(currentId);
            } else {
                yActive.delete(point.parent);
            }
        }
    }

    clear() {
        this.#x_sort.length = 0;
        this.#y_sort.length = 0;
        this.#entities.clear();
        this.#collisionPairs.clear();
    }
}

(function (Scratch) {
    const vm = Scratch?.runtime?.extensionManager?.vm ?? Scratch.vm.extensionManager?.vm;
    vm.Scratch = Scratch;
    //window.vm = vm;
    const {BlockType, ArgumentType, Cast} = Scratch;

    const label = text => ({blockType: BlockType.LABEL, text: text});
    const button = (funcName, text) => ({blockType: BlockType.BUTTON, func: funcName, text: text});

    const color1 = "#63c38e";
    const color2 = "#546d63";
    const color3 = "#caebda";
    const menuIconURI = "https://m.ccw.site/creator-college/images/4715b1ff233284de9eca2873b30e9f41.svg";

    // Fork from https://github.com/TurboWarp/scratch-vm/
    const Pen = class {
        static runtime = Scratch.runtime;
        static _penSkinId = -1;
        static _penDrawableId = -1;

        static toNumber(v) {
            const n = typeof v === 'number' ? v : Number(v);
            return Number.isNaN(n) ? 0 : n;
        }

        static clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

        static rgbToHsv(rgb) {
            const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
            const x = Math.min(r, g, b), v = Math.max(r, g, b);
            let h = 0, s = 0;
            if (x !== v) {
                const f = (r === x) ? g - b : ((g === x) ? b - r : r - g);
                const i = (r === x) ? 3 : ((g === x) ? 5 : 1);
                h = ((i - (f / (v - x))) * 60) % 360;
                s = (v - x) / v;
            }
            return { h, s, v };
        }

        static hsvToRgb(hsv) {
            let h = hsv.h % 360; if (h < 0) h += 360;
            const s = Math.max(0, Math.min(hsv.s, 1));
            const v = Math.max(0, Math.min(hsv.v, 1));
            const i = Math.floor(h / 60), f = h / 60 - i;
            const p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
            let r, g, b;
            switch (i) {
                default: case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break;
            }
            return { r: Math.floor(r*255), g: Math.floor(g*255), b: Math.floor(b*255) };
        }

        static toRgbColorObject(value) {
            if (typeof value === 'string' && value[0] === '#') {
                const hex = value.substring(1);
                const parsed = parseInt(hex, 16);
                if (isNaN(parsed)) return { r: 0, g: 0, b: 0, a: 255 };
                if (hex.length === 6) return { r: (parsed>>16)&0xff, g: (parsed>>8)&0xff, b: parsed&0xff };
                if (hex.length === 3) {
                    const r=(parsed>>8)&0xf, g=(parsed>>4)&0xf, b=parsed&0xf;
                    return { r:(r<<4)|r, g:(g<<4)|g, b:(b<<4)|b };
                }
                return { r: 0, g: 0, b: 0, a: 255 };
            }
            const dec = this.toNumber(value);
            const a = (dec >> 24) & 0xFF;
            return { r: (dec>>16)&0xFF, g: (dec>>8)&0xFF, b: dec&0xFF, a: a > 0 ? a : 255 };
        }

        static get STATE_KEY() { return 'Scratch.pen'; }

        static _getPenSkinId() {
            const renderer = this.runtime.renderer;
            if (this._penSkinId < 0 && renderer) {
                this._penSkinId = renderer.createPenSkin();
                this._penDrawableId = renderer.createDrawable('pen');
                if (renderer.markDrawableAsNoninteractive) renderer.markDrawableAsNoninteractive(this._penDrawableId);
                renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
            }
            return this._penSkinId;
        }

        static _getPenAttrs(target) {
            let state = target._customState[this.STATE_KEY];
            if (!state) {
                state = { color: 66.66, saturation: 100, brightness: 100, transparency: 0,
                        penAttributes: { color4f: [0, 0, 1, 1], diameter: 1 } };
                target.setCustomState(this.STATE_KEY, state);
            }
            return state.penAttributes;
        }

        static _updateColor(state) {
            const rgb = this.hsvToRgb({ h: state.color*3.6, s: state.saturation/100, v: state.brightness/100 });
            const c = state.penAttributes.color4f;
            c[0] = rgb.r/255; c[1] = rgb.g/255; c[2] = rgb.b/255;
            c[3] = 1 - state.transparency / 100;
        }

        static drawLine(target, x1, y1, x2, y2) {
            const skinId = this._getPenSkinId();
            if (skinId >= 0) {
                this.runtime.renderer.penLine(skinId, this._getPenAttrs(target),
                    this.toNumber(x1), this.toNumber(y1), this.toNumber(x2), this.toNumber(y2));
                this.runtime.requestRedraw();
            }
        }

        static stamp(target) {
            const skinId = this._getPenSkinId();
            if (skinId >= 0) {
                this.runtime.renderer.penStamp(skinId, target.drawableID);
                this.runtime.requestRedraw();
            }
        }

        static stampImmediate(target) {
            this.runtime.renderer.updateDrawableProperties(target.drawableID, {
                position: [target.x, target.y],
                direction: target.direction,
                scale: [target.size, target.size],
                visible: target.visible,
                ghost: target.effects?.ghost,
                brightness: target.effects?.brightness,
            });

            this.stamp();
        }

        static setPenColorToColor(target, color) {
            let state = target._customState[this.STATE_KEY];
            if (!state) {
                state = { color: 66.66, saturation: 100, brightness: 100, transparency: 0, penAttributes: { color4f: [0, 0, 1, 1], diameter: 1 } };
                target.setCustomState(this.STATE_KEY, state);
            }
            const rgb = this.toRgbColorObject(color);
            const hsv = this.rgbToHsv(rgb);
            state.color = hsv.h / 3.6;
            state.saturation = hsv.s * 100;
            state.brightness = hsv.v * 100;
            state.transparency = Object.prototype.hasOwnProperty.call(rgb, 'a') ? 100 * (1 - rgb.a / 255) : 0;
            this._updateColor(state);
        }

        static setPenSizeTo(size) {
            const attrs = this._getPenAttrs();
            const limits = this.runtime.runtimeOptions?.miscLimits;
            const hq = this.runtime.renderer?.useHighQualityRender;
            attrs.diameter = (!limits || hq) ? Math.max(0, this.toNumber(size))
                : this.clamp(this.toNumber(size), 1, 1200);
        }

        static clear() {
            const renderer = this.runtime.renderer;
            const skinId = this._getPenSkinId();
            if (skinId >= 0 && renderer) {
                renderer.penClear(skinId);
                this.runtime.requestRedraw();
            }
        }
    };

    // 添加新的时不要忘了初始化
    /**@type {Map<string, object>} */
    const cloneExtraData = new Map();

    /**@type {Map<string, object>} */
    const dataTemplate = new Map();

    /**@type {Map<string, Set<string>>} */
    const groups = new Map();

    /**@type {Map<string, Hitbox>} */
    const Hitboxes = new Map();

    /**@type {SAPCollision} */
    const SAPSystem = new SAPCollision();

    let lastestCreated = {};
    let lastestRemoved = {};

    function triggerHat(opcode, matchFields, target, params = {}, onlyOrigin = false) {
        const threadsStarted = [];
        
        let targets = Array.isArray(target) ? target : (target ? [target] : vm.runtime.target);
        if (onlyOrigin) {
            targets = targets.filter(t => t.isOriginal);
        }
        if (!Array.isArray(target) || targets.length < 1) return;
        
        const matchKeys = matchFields ? Object.keys(matchFields) : [];
        const hasMatchCondition = matchKeys.length > 0;

        for (const currentTarget of targets) {
            if (!currentTarget?.blocks?.getScripts) continue;

            const scripts = currentTarget.blocks.getScripts();

            for (const topBlockId of scripts) {
                const block = currentTarget.blocks.getBlock(topBlockId);

                if (!block || !block.topLevel || block.opcode !== opcode) continue;

                let isMatch = true;
                
                if (hasMatchCondition) {
                    for (let i = 0; i < matchKeys.length; i++) {
                        const key = matchKeys[i];
                        const expectedValue = matchFields[key];
                        
                        let actualValue = "";
                        if (block.fields[key]) {
                            actualValue = block.fields[key].value;
                        } else if (block.inputs[key]) {
                            const input = block.inputs[key];
                            const shadowBlock = currentTarget.blocks.getBlock(input.shadow || input.block);
                            
                            actualValue = 
                                shadowBlock?.fields?.[key]?.value ?? 
                                shadowBlock?.fields?.MENU?.value ??
                                Object.values(shadowBlock?.fields || {})?.[0]?.value;
                        } else {
                            isMatch = false;
                            break;
                        }

                        if (actualValue === undefined || Cast.toString(actualValue) !== Cast.toString(expectedValue)) {
                            isMatch = false;
                            break;
                        }
                    }
                }

                if (!isMatch) continue;

                const thread = vm.runtime._pushThread(topBlockId, currentTarget, {
                    stackClick: false,
                    updateMonitor: false,
                    hatParam: params
                });

                if (thread) {
                    threadsStarted.push(thread);
                }
            }
        }

        return threadsStarted;
    }

    // 把target打成超级拼装
    function flatTarget(target) {
        return {
            "id": target.id,
            "spriteName": target.sprite.name,
            "originalTargetId": target.originalTargetId,
            "x": target.x,
            "y": target.y,
            "direction": target.direction,
            "rotationStyle": target.rotationStyle,
            "size": target.size,
            "costume": target.getCostumes()[target.currentCostume].name,
            "costumeIndex":target.currentCostume,
            "numberOfCostumes": target.getCostumes().length,
            "visiable": target.visible,
            "brightness": target.effects.brightness,
            "ghost": target.effects.ghost,
            "color": target.effects.color,
            "fisheye": target.effects.fisheye,
            "whirl": target.effects.whirl,
            "pixelate": target.effects.pixelate,
            "mosaic": target.effects.mosaic,
            "numberOfSounds": target.getSounds().length,
            "numberOfClones": target.sprite.clones.length - 1,
        };
    }

    if (vm.runtime._CloneProEvents) {
        for (const [name, fn] of vm.runtime._CloneProEvents) {
            vm.runtime.off(name, fn);
        }
    }

    const events = [
        ["PROJECT_START", () => {
            Pen.clear()
            lastestCreated = {};
            lastestRemoved = {};
            cloneExtraData.clear();
            dataTemplate.clear();
            groups.clear();
            Hitboxes.clear();
            SAPSystem.clear();
        }],
        ["targetWasCreated", target => {
            lastestCreated = target;
            const flat = flatTarget(target);
            const name = target.getName();
            triggerHat("ClonePro_whenTargetWasCreated", {SPRITE: name, ONLYORIGIN: true}, vm.runtime.getSpriteTargetByName(name), flat, true);
            triggerHat("ClonePro_whenTargetWasCreated", {SPRITE: name, ONLYORIGIN: false}, null, flat, false);
        }],
        ["targetWasRemoved", target => {
            lastestRemoved = target;
            const flat = flatTarget(target);
            const name = target.getName();
            const id = target.id;
            triggerHat("ClonePro_whenTargetWasRemoved", {SPRITE: name, ONLYORIGIN: true}, vm.runtime.getSpriteTargetByName(name), flat, true);
            triggerHat("ClonePro_whenTargetWasRemoved", {SPRITE: name, ONLYORIGIN: false}, null, flat, false);

            groups.forEach(g => g.delete(id));
            cloneExtraData.delete(id);
            Hitboxes.delete(id);
            SAPSystem.removeEntity(id);
        }],
        ["PROJECT_STOP_ALL", () => Pen.clear()]
    ];

    vm.runtime._CloneProEvents = events;
    for (const [name, fn] of events) {
        vm.runtime.on(name, fn);
    }

    class ClonePro {
        getInfo() {
            return {
                id: "ClonePro",
                name: "Better Clone",
                color1: color1, 
                color2: color2, 
                color3: color3,
                menuIconURI: menuIconURI,
                blocks: [
                    label("感觉dolly设计的挺奇怪的所以我想自己写一个，肯定没dolly好（"),
                    label("Basic Information"),
                    {
                        opcode: "isOrigin",
                        blockType: BlockType.BOOLEAN,
                        text: "Am I origin?",
                        arguments: {}
                    },
                    {
                        opcode: "myId",
                        blockType: BlockType.REPORTER,
                        text: "My id",
                        arguments: {}
                    },
                    {
                        opcode: "myArribute",
                        blockType: BlockType.REPORTER,
                        text: "My [ATTRIBUTE]",
                        arguments: {
                            ATTRIBUTE: {
                                menu: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "itsArribute",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s [ATTRIBUTE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            ATTRIBUTE: {
                                menu: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "myDollyArribute",
                        blockType: BlockType.REPORTER,
                        text: "My dolly- [DOLLY_ATTRIBUTE]",
                        arguments: {
                            DOLLY_ATTRIBUTE: {
                                type: ArgumentType.STRING,
                                defaultValue: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "itsDollyArribute",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s dolly- [DOLLY_ATTRIBUTE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            DOLLY_ATTRIBUTE: {
                                type: ArgumentType.STRING,
                                defaultValue: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "idExist",
                        blockType: BlockType.BOOLEAN,
                        text: "Does the [ID] exist?",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "spriteCloneList",
                        blockType: BlockType.REPORTER,
                        text: "All clones' id of [SPRITE] (include origin?[ORIGIN])",
                        arguments: {
                            SPRITE: {
                                menu: "allSpriteList",
                            },
                            ORIGIN: {
                                menu: "boolValue"
                            }
                        }
                    },
                    {
                        opcode: "originId",
                        blockType: BlockType.REPORTER,
                        text: "Origin of [SPRITE]'s id",
                        arguments: {
                            SPRITE: {
                                menu: "spriteList",
                            }
                        }
                    },
                    label("Clone"),
                    {
                        opcode: "defineDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Define data template: [NAME] with x:[X] y:[Y] dir:[DIRECTION] rotation style:[ROTATIONSTYLE] size:[SIZE] costume:[COSTUME] visiable:[VISIABLE] brightness:[BRIGHTNESS] ghost:[GHOST] color:[COLOR] fisheye:[FISHEYE] whirl:[WHIRL] pixelate:[PIXELATE] mosaic:[MOSAIC]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "template name"
                            },
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            DIRECTION: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 90
                            },
                            ROTATIONSTYLE: {
                                menu: "rotationStyle",
                            },
                            SIZE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            COSTUME: {
                                type: ArgumentType.COSTUME,
                            },
                            VISIABLE: {
                                menu: "boolValue",
                                defaultValue: "true"
                            },
                            BRIGHTNESS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            GHOST: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            FISHEYE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            WHIRL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PIXELATE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            MOSAIC: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "modifyDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Modify the template [NAME] data [DATA] to [VALUE]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "template name"
                            },
                            DATA: {
                                menu: "templateData",
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Delete the data template [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "template"
                            }
                        }
                    },
                    {
                        opcode: "clearDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Clear all data templates",
                        arguments: {}
                    },
                    {
                        opcode: "cloneWithTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Clone [SPRITE] with template [NAME]",
                        arguments: {
                            SPRITE: {
                                menu: "spriteList"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "template"
                            }
                        }
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `
                            <block type="control_create_clone_of">
                            <value name="CLONE_OPTION">
                                <shadow type="control_create_clone_of_menu">
                                <field name="CLONE_OPTION">_myself_</field>
                                </shadow>
                            </value>
                            </block>
                        `
                    },
                    {
                        opcode: "removeClone",
                        blockType: BlockType.COMMAND,
                        text: "Remove the clone [ID]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `
                            <block type="control_delete_this_clone"></block>
                        `
                    },
                    {
                        opcode: "latestCloneId",
                        blockType: BlockType.REPORTER,
                        text: "Latest clone ID",
                        arguments: {}
                    },
                    {
                        opcode: "latestRemoveId",
                        blockType: BlockType.REPORTER,
                        text: "Latest remove ID",
                        arguments: {}
                    },
                    {
                        opcode: "whenTargetWasCreated",
                        blockType: BlockType.EVENT,
                        text: "When [SPRITE] clone was created (only origin? [ONLYORIGIN])",
                        isEdgeActivated: false,
                        arguments: {
                            SPRITE: {
                                menu: "staticSpriteList",
                                type: ArgumentType.STRING
                            },
                            ONLYORIGIN: {
                                menu: "staticBoolValue",
                                defaultValue: "false",
                            }
                        }
                    },
                    {
                        opcode: "whenTargetWasRemoved",
                        blockType: BlockType.EVENT,
                        text: "When [SPRITE] clone was removed (only origin? [ONLYORIGIN])",
                        isEdgeActivated: false,
                        arguments: {
                            SPRITE: {
                                menu: "staticSpriteList",
                                type: ArgumentType.STRING
                            },
                            ONLYORIGIN: {
                                menu: "staticBoolValue",
                                defaultValue: "false",
                            }
                        }
                    },
                    label("Extra data"),
                    {
                        opcode: "setExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Set my extra data [NAME] [OPERATOR] [VALUE]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Delete my extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "getExtraData",
                        blockType: BlockType.REPORTER,
                        text: "My extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "hasExtraData",
                        blockType: BlockType.BOOLEAN,
                        text: "Has extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifExtraData",
                        blockType: BlockType.CONDITIONAL,
                        text: "If my extra data [NAME]:",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifExtraDataEqualsTo",
                        blockType: BlockType.CONDITIONAL,
                        text: "If my extra data [NAME] [COMPARE] [VALUE]:",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            COMPARE: {
                                menu: "compare",
                                defaultValue: "==="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "insExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, my data [NAME]+=1 each time:",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "repeatExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, my data [NAME] [OPERATOR] [VALUE] each time (initValue [INIT]):",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "+="
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1"
                            },
                            INIT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "setIdExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Set [ID]'s extra data [NAME] [OPERATOR] [VALUE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteIdExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Delete [ID]'s extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "getIdExtraData",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "IdHasExtraData",
                        blockType: BlockType.BOOLEAN,
                        text: "[ID] has extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifIdExtraData",
                        blockType: BlockType.CONDITIONAL,
                        text: "If [ID] extra data [NAME]:",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifIdExtraDataEqualsTo",
                        blockType: BlockType.CONDITIONAL,
                        text: "If [ID] extra data [NAME] [COMPARE] [VALUE]:",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            COMPARE: {
                                menu: "compare",
                                defaultValue: "==="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "idInsExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, [ID]'s data [NAME]+=1 each time:",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            ID: {
                                type: ArgumentType.STRING, 
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "idRepeatExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, [ID]'s data [NAME] [OPERATOR] [VALUE] each time (initValue [INIT]):",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            ID: {
                                type: ArgumentType.STRING, 
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "+="
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1"
                            },
                            INIT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        }
                    },
                    label("Group"),
                    {
                        opcode: "createGroup",
                        blockType: BlockType.COMMAND,
                        text: "Create a group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "deleteGroup",
                        blockType: BlockType.COMMAND,
                        text: "Delete the group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "hasGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Has the group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "joinGroup",
                        blockType: BlockType.COMMAND,
                        text: "Join the group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "leaveGroup",
                        blockType: BlockType.COMMAND,
                        text: "Leave the group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "inGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Did I join the group [NAME]?",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "IdJoinGroup",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] join the group [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "IdLeaveGroup",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] leave the group [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "IdInGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Did [ID] join the group [NAME]?",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "membersOfGroup",
                        blockType: BlockType.REPORTER,
                        text: "Members of group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "sizeOfGroup",
                        blockType: BlockType.REPORTER,
                        text: "The size of the group [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    label("Hitbox"),
                    {
                        opcode: "createHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create hitbox for me with default polygon [POLYGON]",
                        arguments: {
                            POLYGON: {
                                type: null
                            },
                        },
                    },
                    {
                        opcode: "createRectangle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Rectangle x:[X] y:[Y] width:[W] height:[H]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        },
                    },
                    {
                        opcode: "createRectHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create rectangular hitbox for me x:[X] y:[Y] width:[W] height:[H]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        },
                    },
                    {
                        opcode: "setHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set my hitbox [NAME] to [POLYGON]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            POLYGON: {
                                type: null
                            },
                        },
                    },
                    {
                        opcode: "deleteHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Delete my hitbox [NAME]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            }
                        },
                    },
                    {
                        opcode: "createTriangle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Create a triangle ([X0], [Y0]) ([X1], [Y1]) ([X2], [Y2])",
                        arguments: {
                            X0: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y0: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        },
                    },
                    {
                        opcode: "createPolygon",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Create a polygon with triangle [TRIANGLE]",
                        arguments: {
                            TRIANGLE: {
                                type: null
                            }
                        }
                    },
                    {
                        opcode: "appendForPolygon",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Append a triangle [TRIANGLE] to the polygon [POLYGON]",
                        arguments: {
                            POLYGON: {
                                type: null
                            },
                            TRIANGLE: {
                                type: null
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "collisionTo",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did my hitbox [TYPE] touch id [ID]?",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        }
                    },
                    {
                        opcode: "idCollisionTo",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did [ID]'s hitbox [TYPE] touch id [TARGET]? In SAP?[SAP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            TARGET: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "collisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did my hitbox [TYPE] touch the group [GROUP]? In SAP?[SAP]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "idCollisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did [ID]'s hitbox [TYPE] touch the group [GROUP]? In SAP?[SAP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "groupCollisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did group [GROUP1] [TYPE] touch the group [GROUP2]? In SAP?[SAP]",
                        arguments: {
                            GROUP1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "transform",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Transform my hitboxes [OFFSETX] [OFFSETY] [SCALE] [ROTATE] [FOLLOWCAM] [CAMX] [CAMY] [CAMSCALE] [CAMROTATE]",
                        arguments: {
                            OFFSETX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            OFFSETY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            ROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            FOLLOWCAM: {
                                type: Scratch.ArgumentType.BOOLEAN,
                                defaultValue: false
                            },
                            CAMX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CAMROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "transformWithoutData",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Transform my hitboxes based on my attributes [FOLLOWCAM] [CAMX] [CAMY] [CAMSCALE] [CAMROTATE]",
                        arguments: {
                            FOLLOWCAM: {
                                type: Scratch.ArgumentType.BOOLEAN,
                                defaultValue: false
                            },
                            CAMX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CAMROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "drawHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Draw my hitbox [NAME] in color [COLOR]",
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            }
                        },
                    },
                    {
                        opcode: "clear",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Clear all",
                        arguments: {},
                    },
                    label("SAP (Sweep And Prune)"),
                    label("这是一种基于AABB实现的快速排除不可能碰撞物体的算法，自己去查"),
                    label("说人话就是增快效率，代价是占用空间，在物体数量小的情况下不需要使用"),
                    {
                        opcode: "joinSAP",
                        blockType: BlockType.COMMAND,
                        text: "Join the SAP system",
                        arguments: {}
                    },
                    {
                        opcode: "leaveSAP",
                        blockType: BlockType.COMMAND,
                        text: "Leave the SAP system",
                        arguments: {}
                    },
                    {
                        opcode: "moveInSAP",
                        blockType: BlockType.COMMAND,
                        text: "Move in SAP system.",
                        arguments: {}
                    },
                    {
                        opcode: "idJoinSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] join the SAP system",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "idLeaveSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] leave the SAP system",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "idMoveInSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] move in SAP system.",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "updateSAP",
                        blockType: BlockType.COMMAND,
                        text: "Update the SAP system",
                        arguments: {}
                    },
                    label("Messages"),
                    {
                        opcode: "sendMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Send a message [NAME] with data [DATA] to [ID_FILTER] [SPRITE_FILTER] [GROUP_FILTER] (only origin?[ONLYORIGIN])",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "massage name"
                            },
                            DATA: {
                                type: ArgumentType.STRING,
                                defaultValue: "extra data"
                            },
                            ID_FILTER: {
                                type: ArgumentType.STRING,
                                defaultValue: "target id"
                            },
                            SPRITE_FILTER: {
                                menu: "stageSpriteList"
                            },
                            GROUP_FILTER: {
                                type: ArgumentType.STRING,
                                defaultValue: "group name"
                            },
                            ONLYORIGIN: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "receiveMessage",
                        blockType: Scratch.BlockType.EVENT,
                        text: "When I received message [NAME]",
                        isEdgeActivated: false,
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "massage name"
                            }
                        }
                    },
                    label("Thread infomation"),
                    {
                        opcode: "hatParam",
                        blockType: BlockType.REPORTER,
                        text: "Hat parameter [VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            }
                        }
                    },
                    {
                        opcode: "setThreadVar",
                        blockType: BlockType.COMMAND,
                        text: "Set thread variable [KEY] [OPERATOR] [VALUE]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            },
                        }
                    },
                    {
                        opcode: "getThreadVar",
                        blockType: BlockType.REPORTER,
                        text: "Get thread variable [KEY]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            }
                        }
                    },
                    label("NB Tools"),
                    {
                        opcode: "log",
                        blockType: BlockType.COMMAND,
                        text: "console.[METHOD]([PARAM])",
                        arguments: {
                            METHOD: {
                                menu: "consoleMethod",
                                defaultValue: "log"
                            },
                            PARAM: {
                                type: ArgumentType.STRING,
                                defaultValue: "message"
                            }
                        }
                    },
                    {
                        opcode: "boolValue",
                        blockType: BlockType.BOOLEAN,
                        text: "[VALUE]",
                        arguments: {
                            VALUE: {
                                menu: "boolValue"
                            }
                        }
                    },
                    {
                        opcode: "str",
                        blockType: BlockType.REPORTER,
                        text: "[VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `
                            <block type="looks_costume"></block>
                        `
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `
                            <block type="ClonePro_menu_rotationStyle"></block>
                        `
                    },
                    {
                        opcode: "nullValue",
                        blockType: BlockType.REPORTER,
                        text: "null",
                        arguments: {}
                    },
                    {
                        opcode: "typeofObject",
                        blockType: BlockType.REPORTER,
                        text: "typeof [VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    label("相关信息"),
                    button("authorURL", "打开作者主页"),
                    button("ccwDocument", "打开文档"),
                ],
                menus: {
                    attribute: {
                        acceptReporters: true,
                        items: ["id", "spriteName", "isOrigin", "originalTargetId", "x", "y", "direction", "rotationStyle", "size", "costume", "costumeIndex", "numberOfCostumes", "visiable", "brightness", "ghost", "color", "fisheye", "whirl", "pixelate", "mosaic", "numberOfSounds", "numberOfClones"]
                    },
                    rotationStyle: {
                        acceptReporters: true,
                        items: ["all around", "left-right", "don't rotate"]
                    },
                    templateData: {
                        acceptReporters: true,
                        items: ["X","Y","DIRECTION","ROTATIONSTYLE","SIZE","COSTUME","VISIABLE","BRIGHTNESS","GHOST","COLOR","FISHEYE","WHIRL","PIXELATE","MOSAIC"]
                    },
                    boolValue: {
                        acceptReporters: true,
                        items: ["true", "false"]
                    },
                    staticBoolValue: {
                        acceptReporters: false,
                        items: ["true", "false"]
                    },
                    allSpriteList: {
                        acceptReporters: true,
                        items: "_findAllSpriteList"
                    },
                    spriteList: {
                        acceptReporters: true,
                        items: "_findSpriteList"
                    },
                    stageSpriteList: {
                        acceptReporters: true,
                        items: "_findStageSpriteList"
                    },
                    staticSpriteList: {
                        acceptReporters: false,
                        items: "_findSpriteList"
                    },
                    operators: {
                        acceptReporters: true,
                        items: ["=", "+=", "-=", "*=", "/=", "//=", "**=", "%="]
                    },
                    consoleMethod: {
                        acceptReporters: true,
                        items: ["debug","error","info","log","warn","dir","table","trace","group","groupCollapsed","groupEnd","clear","count","countReset","profile","profileEnd","time","timeLog","timeEnd","timeStamp"]  // 直接JSON.stringify(Object.keys(console))出来的再踢掉一些
                    },
                    compare: {
                        acceptReporters: true,
                        items: ["===", "==", ">", "<", ">=", "<=", "!="]
                    }
                }
            };
        }

        _findMyDollyAttributes(id) {
            if (!vm.runtime.getTargetById(id).DollyPro) return ["Please install the Dolly Pro extension first."];
            const data = Object.keys(vm.runtime.getTargetById(id)?.DollyPro?.extraData);
            data.unshift("allTags");
            return data;
        };
        _findAllSpriteList(stage) {
            const lists = this._findSpriteList(stage);
            lists.unshift("All Sprites");
            return lists;
        }
        _findSpriteList(stage = false) {
            const lists = vm.runtime.targets.filter(t => t.isOriginal && (stage || !t.isStage)).map(t => t.getName());
            return lists;
        }
        _findStageSpriteList() {
            return this._findAllSpriteList(true);
        }

        #calc(oldValue, operator, newValue) {
            switch (operator) {
                case "=":
                    return newValue;
                case "+=":
                    return oldValue + newValue;
                case "-=":
                    return oldValue - newValue;
                case "*=":
                    return oldValue * newValue;
                case "/=":
                    return oldValue / newValue;
                case "**=":
                    return oldValue ** newValue;
                case "//=":
                    return Math.floor(oldValue / newValue);
                case "%=":
                    return oldValue % newValue;
                default: return 0;
            }
        }

        #compare(value1, compare, value2) {
            switch (compare) {
                case "===":return value1 === value2;
                case "==":return value1 == value2;
                case ">":return value1 > value2;
                case "<":return value1 < value2;
                case ">=":return value1 >= value2;
                case "<=":return value1 <= value2;
                case "!=":return value1 != value2;
                default: return false;
            }
        }

        #getAttribute(id, attr, givenTarget) {
            const target = givenTarget ?? vm?.runtime?.getTargetById?.(id);
            if (!target) return "";
            switch (attr) {
                case "id": return id;
                case "spriteName": return target.getName();
                case "isOrigin": return target.isOriginal;
                case "originalTargetId": return target.originalTargetId;
                case "x": return target.x;
                case "y": return target.y;
                case "direction": return target.direction;
                case "rotationStyle": return target.rotationStyle;
                case "size": return target.size;
                case "costume": return target.getCostumes()[target.currentCostume].name;
                case "costumeIndex": return target.currentCostume;
                case "numberOfCostumes": return target.getCostumes().length;
                case "visiable": return target.visible;
                case "brightness": return target.effects.brightness;
                case "ghost": return target.effects.ghost;
                case "color": return target.effects.color;
                case "fisheye": return target.effects.fisheye;
                case "whirl": return target.effects.whirl;
                case "pixelate": return target.effects.pixelate;
                case "mosaic": return target.effects.mosaic;
                case "numberOfSounds": return target.getSounds().length;
                case "numberOfClones": return target.sprite.clones.length - 1; // 本体也在clones列表里面
                default: return "";
            }
        }

        #cloneList(SPRITE, ORIGIN) {
            let list;
            if (SPRITE === "All Sprites") list = vm?.runtime?.targets;
            else list = vm?.runtime?.getSpriteTargetByName?.(SPRITE)?.sprite?.clones;

            if (!list) return [];

            if (ORIGIN === "false" || !ORIGIN) list = list.filter(i => !i.isOriginal);
            list = list.map(c => c.id);
            return list;
        }

        isOrigin(args, util) {
            return Cast.toBoolean(util?.target?.isOriginal);
        }

        myId(args, util) {
            return util?.target?.id;
        }

        myArribute({ATTRIBUTE}, util) {
            return this.#getAttribute(util?.target?.id, ATTRIBUTE, util?.target);
        }

        itsArribute({ID, ATTRIBUTE}, util) {
            return this.#getAttribute(ID, ATTRIBUTE);
        }

        myDollyArribute({DOLLY_ATTRIBUTE}, util) {
            return util?.target?.DollyPro?.extraData?.[DOLLY_ATTRIBUTE];
        }

        itsDollyArribute({ID, DOLLY_ATTRIBUTE}, util) {
            return vm.runtime?.getTargetById(ID)?.DollyPro?.extraData?.[DOLLY_ATTRIBUTE];
        }

        idExist({ID}) {
            return Cast.toBoolean(vm?.runtime?.getTargetById(ID));
        }

        spriteCloneList({SPRITE, ORIGIN}) { 
            return JSON.stringify(this.#cloneList(SPRITE, ORIGIN));
        }

        originId({SPRITE}) {
            return vm?.runtime?.getSpriteTargetByName?.(SPRITE)?.id;
        }

        defineDataTemplate({NAME,X,Y,DIRECTION,ROTATIONSTYLE,SIZE,COSTUME,VISIABLE,BRIGHTNESS,GHOST,COLOR,FISHEYE,WHIRL,PIXELATE,MOSAIC}) {
            dataTemplate.set(NAME, {NAME,X,Y,DIRECTION,ROTATIONSTYLE,SIZE,COSTUME,VISIABLE,BRIGHTNESS,GHOST,COLOR,FISHEYE,WHIRL,PIXELATE,MOSAIC});
        }

        modifyDataTemplate({NAME, DATA, VALUE}) {
            if (!dataTemplate.has(NAME)) return;
            dataTemplate.get(NAME)[DATA] = VALUE;
        }

        deleteDataTemplate({NAME}) {
            dataTemplate.delete(NAME);
        }

        clearDataTemplate() {
            dataTemplate.clear();
        }

        cloneWithTemplate({SPRITE, NAME}) {
            if (!dataTemplate.has(NAME)) return;
            const target = vm.runtime.getSpriteTargetByName(SPRITE);
            const clone = target.makeClone();
            const template = dataTemplate.get(NAME);
            if (template) {
                // 这貌似有点多
                clone.setXY(template.X, template.Y);
                clone.setDirection(template.DIRECTION);
                clone.setRotationStyle(template.ROTATIONSTYLE);
                clone.setCostume(clone.getCostumeIndexByName(template.COSTUME));
                clone.setEffect("ghost", template.GHOST);
                clone.setEffect("brightness", template.BRIGHTNESS);
                clone.setEffect("fisheye", template.FISHEYE);
                clone.setEffect("color", template.COLOR);
                clone.setEffect("whirl", template.WHIRL);
                clone.setEffect("mosaic", template.MOSAIC);
                clone.setEffect("pixelate", template.PIXELATE);
                clone.setSize(template.SIZE);
                clone.setVisible(template.VISIABLE);
            }
            clone.goBehindOther(target);

            vm.runtime.addTarget(clone);
        }

        removeClone({ID}) {
            const target = vm.runtime.getTargetById(ID);
            if (!target || target.isOriginal) return;
            vm.runtime.disposeTarget(target);
            vm.runtime.stopForTarget(target);
        }

        latestCloneId() {
            return lastestCreated.id ?? "";
        }

        latestRemoveId() {
            return lastestRemoved.id ?? "";
        }

        whenTargetWasCreated() {return true;}
        whenTargetWasRemoved() {return true;}

        #setIdExtraData(ID, NAME, OPERATOR, VALUE) {
            if (!cloneExtraData.has(ID)) cloneExtraData.set(ID, {});
            const treeKey = cloneExtraData.get(ID);
            if (!Object.hasOwn(treeKey, NAME)) treeKey[NAME] = 0;

            treeKey[NAME] = this.#calc(treeKey[NAME], OPERATOR, VALUE);
        }

        #deleteIdExtraData(ID, NAME) {
            if (this.#IdHasExtraData(ID, NAME)) delete cloneExtraData.get(ID)[NAME];
        }

        #getIdExtraData(ID, NAME) {
            return cloneExtraData.get(ID)?.[NAME];
        }

        #IdHasExtraData(ID, NAME) {
            return cloneExtraData.has(ID) && Object.hasOwn(cloneExtraData.get(ID), NAME);
        }

        #ifIdExtraData(ID, NAME) {
            return Cast.toBoolean(this.#getIdExtraData(ID, NAME));
        }

        #ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE) {
            const myValue = this.#getIdExtraData(ID, NAME);
            return this.#compare(myValue, COMPARE, VALUE);
        }

        #repeat(ID, NAME, TIMES, OPERATOR, VALUE, INIT, util) {
            const times = Math.round(TIMES);

            if (typeof util.stackFrame.loopCounter === "undefined") {
                util.stackFrame.loopCounter = 0;
                if (typeof INIT === "number") this.#setIdExtraData(ID, NAME, "=", INIT);
            }

            if (util.stackFrame.loopCounter < times) {
                util.startBranch(1, true);
                util.stackFrame.loopCounter++;
                this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
            }
        }

        setExtraData({NAME, OPERATOR, VALUE}, util) {
            const ID = util.target.id;
            this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
        }

        deleteExtraData({NAME}, util) {
            const ID = util.target.id;
            this.#deleteIdExtraData(ID, NAME);
        }

        getExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#getIdExtraData(ID, NAME);
        }

        hasExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#IdHasExtraData(ID, NAME);
        }

        ifExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#ifIdExtraData(ID, NAME);
        }

        ifExtraDataEqualsTo({NAME, COMPARE, VALUE}, util) {
            const ID = util.target.id;
            return this.#ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE);
        }

        insExtraData({NAME, TIMES}, util) {
            this.#repeat(util.target.id, NAME, TIMES, "+=", 1, null, util);
        }

        repeatExtraData({NAME, TIMES, OPERATOR, VALUE, INIT}, util) {
            this.#repeat(util.target.id, NAME, TIMES, OPERATOR, VALUE, INIT, util);
        }

        idInsExtraData({ID, NAME, TIMES}, util) {
            this.#repeat(ID, NAME, TIMES, "+=", 1, null, util);
        }

        idRepeatExtraData({ID, NAME, TIMES, OPERATOR, VALUE, INIT}, util) {
            this.#repeat(ID, NAME, TIMES, OPERATOR, VALUE, INIT, util);
        }

        setIdExtraData({ID, NAME, OPERATOR, VALUE}) {
            this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
        }

        deleteIdExtraData({ID, NAME}) {
            this.#deleteIdExtraData(ID, NAME);
        }

        getIdExtraData({ID, NAME}) {
            return this.#getIdExtraData(ID, NAME);
        }

        IdHasExtraData({ID, NAME}) {
            return this.#IdHasExtraData(ID, NAME);
        }

        ifIdExtraData({ID, NAME}) {
            return this.#ifIdExtraData(ID, NAME);
        }

        ifIdExtraDataEqualsTo({ID, NAME, COMPARE, VALUE}, util) {
            return this.#ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE);
        }

        createGroup({NAME}) {
            groups.set(NAME, new Set());
        }

        deleteGroup({NAME}) {
            groups.delete(NAME);
        }

        hasGroup({NAME}) {
            return groups.has(NAME);
        }

        joinGroup({NAME}, util) {
            const ID = util.target.id;
            groups.get(NAME)?.add?.(ID);
        }

        leaveGroup({NAME}, util) {
            const ID = util.target.id;
            groups.get(NAME)?.delete?.(ID);
        }

        inGroup({NAME}, util) {
            const ID = util.target.id;
            return Cast.toBoolean(groups.get(NAME)?.has?.(ID));
        }

        IdJoinGroup({ID, NAME}) {
            groups.get(NAME)?.add?.(ID);
        }

        IdLeaveGroup({ID, NAME}) {
            groups.get(NAME)?.delete?.(ID);
        }

        IdInGroup({ID, NAME}) {
            return groups.get(NAME)?.has?.(ID);
        }

        membersOfGroup({NAME}) {
            if (!groups.has(NAME)) return "[]";
            return JSON.stringify([...groups.get(NAME)])
        }

        sizeOfGroup({NAME}) {
            return groups.get(NAME)?.size ?? 0;
        }

        createHitbox({POLYGON}, util) {
            if (POLYGON instanceof Polygon) Hitboxes.set(this.myId(null, util), new Hitbox(POLYGON));
            else Hitboxes.set(this.myId(null, util), new Hitbox(new Polygon()));
        }

        createRectangle({X, Y, W, H}) {
            return Hitbox.rectangle(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(W), Cast.toNumber(H));
        }

        createRectHitbox({X, Y, W, H}, util) {
            Hitboxes.set(this.myId(null, util), Hitbox.rectBox(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(W), Cast.toNumber(H)));
        }

        setHitbox({NAME, POLYGON}, util) {
            if (!(POLYGON instanceof Polygon)) return;
            Hitboxes.get(util.target.id)?.setBox?.(NAME, POLYGON);
        }

        deleteHitbox({NAME}, util) {
            try {
                Hitboxes.get(util.target.id)?.deleteBox?.(NAME);
            } catch (e) {}
        }

        createTriangle({X0, Y0, X1, Y1, X2, Y2}) {
            return new Triangle(Cast.toNumber(X0), Cast.toNumber(Y0), Cast.toNumber(X1), Cast.toNumber(Y1), Cast.toNumber(X2), Cast.toNumber(Y2));
        }

        createPolygon({TRIANGLE}) {
            if (TRIANGLE instanceof Triangle) {
                return new Polygon(TRIANGLE);
            }
            return new Polygon();
        }

        appendForPolygon({POLYGON, TRIANGLE}) {
            return POLYGON?.append?.(TRIANGLE);
        }

        #idCollisionId(ID1, TYPE1, ID2, TYPE2, aabb = true) {
            if (!Hitboxes.has(ID1) || !Hitboxes.has(ID2)) return false;
            return Hitboxes.get(ID1)?.collision(TYPE1, Hitboxes.get(ID2), TYPE2, aabb);
        }

        #idcollisionGroup(ID1, TYPE1, GROUP, TYPE2, SAP) {
            if (!Hitboxes.has(ID1)) return false;
            const groupEntities = groups.get(GROUP);
            if (!groupEntities) return;
            if (SAP === "true") {
                for (const id of SAPSystem.getPotentialCollisions(ID1)) {
                    if (groupEntities.has(id)) {
                        // 自己不会是自己的潜在碰撞对
                        if (this.#idCollisionId(ID1, TYPE1, id, TYPE2, false)) return true;
                    }
                }
            } else {
                for (const id of groupEntities) {
                    if (id !== ID1) {
                        if (this.#idCollisionId(ID1, TYPE1, id, TYPE2)) return true;
                    }
                }
            }
            return false;
        }

        collisionTo({TYPE, ID}, util) {
            return this.#idCollisionId(util.target.id, TYPE, ID, TYPE);
        }

        idCollisionTo({ID, TYPE, TARGET}) {
            return this.#idCollisionId(ID, TYPE, TARGET, TYPE);
        }

        collisionGroup({TYPE, GROUP, SAP}, util) {
            return this.#idcollisionGroup(util.target.id, TYPE, GROUP, TYPE, SAP);
        }

        idCollisionGroup({ID, TYPE, GROUP, SAP}) {
            return this.#idcollisionGroup(ID, TYPE, GROUP, TYPE, SAP);
        }

        groupCollisionGroup({GROUP1, TYPE, GROUP2, SAP}) {
            const group1Entities = groups.get(GROUP1);
            const group2Entities = groups.get(GROUP2);
            if (!group1Entities || !group2Entities) return;
            for (const id1 of group1Entities) {
                if (this.#idcollisionGroup(id1, TYPE, group2Entities, TYPE, SAP));
            }
        }

        drawHitbox(args, util) {
            const myId = this.myId(null, util);
            const hitbox = Hitboxes.get(myId)?.getBox?.(args.NAME);

            if (!hitbox) return;

            const target = util.target;
            Pen.setPenColorToColor(target, args.COLOR);
            for (const tri of hitbox.triangles) {
                Pen.drawLine(target, tri.vertexes[0][0], tri.vertexes[0][1], tri.vertexes[1][0], tri.vertexes[1][1]);
                Pen.drawLine(target, tri.vertexes[2][0], tri.vertexes[2][1], tri.vertexes[1][0], tri.vertexes[1][1]);
                Pen.drawLine(target, tri.vertexes[2][0], tri.vertexes[2][1], tri.vertexes[0][0], tri.vertexes[0][1]);
            }
        }

        clear() {
            Pen.clear();
        }

        joinSAP(args, util) {
            const id = util.target.id;
            const bounding = Hitboxes.get(id)?.bounding;
            SAPSystem.addEntity(id, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        leaveSAP(args, util) {
            SAPSystem.removeEntity(util.target.id);
        }

        moveInSAP(args, util) {
            const id = util.target.id;
            const bounding = Hitboxes.get(id)?.bounding;
            SAPSystem.moveEntity(id, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        idJoinSAP({ID}) {
            const bounding = Hitboxes.get(ID)?.bounding;
            SAPSystem.addEntity(ID, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        idLeaveSAP({ID}) {
            SAPSystem.removeEntity(ID);
        }

        idMoveInSAP({ID}) {
            const bounding = Hitboxes.get(ID)?.bounding;
            SAPSystem.moveEntity(ID, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        updateSAP() {
            SAPSystem.update();
        }

        sendMessage({NAME, DATA, ID_FILTER, SPRITE_FILTER, GROUP_FILTER, ONLYORIGIN}, util) {
            let targets;

            if (ID_FILTER) {
                // 通过ID过滤了顶多一个实体
                const target = vm.runtime.getTargetById(ID_FILTER);
                if (!target?.isOriginal && ONLYORIGIN) return;  // id不是本体但是only origin就无合适目标，直接返回
                targets = target;
            } else {
                targets = vm.runtime.targets.filter(t => 
                    (!SPRITE_FILTER || t.sprite.name === SPRITE_FILTER) &&  // 如果有sprite_filter则检查是否匹配，否则放行
                    (!GROUP_FILTER || groups.get(GROUP_FILTER)?.has?.(t.id)) &&  // 如果有group_filter则检查是否匹配
                    (!ONLYORIGIN || t?.isOriginal)  // 不限制必须本体或者当前target是本体
                );
                if (targets.length < 1) return;
            }

            triggerHat("ClonePro_receiveMessage", {NAME: NAME}, targets, {data: DATA, sender: util.target.id});
        }

        receiveMessage({NAME}, util) {return true;}

        transform({OFFSETX, OFFSETY, SCALE, ROTATE, FOLLOWCAM, CAMX, CAMY, CAMSCALE, CAMROTATE}, util) {
            Hitboxes.get(this.myId(null, util))?.translate?.(
                Cast.toNumber(OFFSETX), 
                Cast.toNumber(OFFSETY), 
                Cast.toNumber(SCALE) / 100, 
                90 - Cast.toNumber(ROTATE), 
                Cast.toBoolean(FOLLOWCAM), 
                Cast.toNumber(CAMX), 
                Cast.toNumber(CAMY), 
                Cast.toNumber(CAMSCALE), 
                90 - Cast.toNumber(CAMROTATE)
            );
        }

        transformWithoutData({FOLLOWCAM, CAMX, CAMY, CAMSCALE, CAMROTATE}, util) {
            const target = util.target;
            if (!target) return;
            Hitboxes.get(this.myId(null, util))?.translate?.(
                Cast.toNumber(target.x),
                Cast.toNumber(target.y), 
                Cast.toNumber(target.size) / 100, 
                90 - Cast.toNumber(target.direction), 
                Cast.toBoolean(FOLLOWCAM),
                Cast.toNumber(CAMX), 
                Cast.toNumber(CAMY), 
                Cast.toNumber(CAMSCALE),
                90 - Cast.toNumber(CAMROTATE)
            );
        }

        hatParam({VALUE}, util) {
            return util?.thread?.hatParam?.[VALUE];
        }

        setThreadVar({KEY, OPERATOR, VALUE}, util) {
            const thread = util.thread;
            if (!thread.cloneProData) thread.cloneProData = {};
            thread.cloneProData[KEY] = this.#calc(thread.cloneProData[KEY], OPERATOR, VALUE);
        }

        getThreadVar({KEY}, util) {
            return util.thread?.cloneProData?.[KEY];
        }

        log({METHOD, PARAM}, util) {
            console[METHOD]?.(PARAM);
        }

        boolValue({VALUE}) {
            if (VALUE === "false") return false;
            return Cast.toBoolean(VALUE);
        }

        str({VALUE}) {
            return Cast.toString(VALUE);
        }

        nullValue() {
            return null;
        }

        typeofObject({VALUE}) {
            return Object.prototype.toString.call(VALUE).slice(7, -1);
        }

        authorURL() {
            window.open("https://www.ccw.site/student/65f8238ca65f1229b0d8c776");
        }

        ccwDocument() {
            window.open("https://learn.ccw.site/article/f29a698b-12eb-4073-b545-50030362c63e");
        }
    }

  Scratch.extensions.register(new ClonePro());
})(Scratch);