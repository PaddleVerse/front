import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoundingBox } from "./Box";

interface Position {
  x: number;
  y: number;
  z: number;
}

class Paddle {
  scene: THREE.Scene;
  position: Position;
  object: THREE.Object3D;
  velocity: THREE.Vector3;
  boundingBox: BoundingBox;
  rotationX: number;

  constructor(scene: THREE.Scene, position: Position) {
    this.scene = scene;
    this.position = position;
    this.object = new THREE.Object3D(); // Create a new object
    this.velocity = new THREE.Vector3(); // Initialize velocity
    this.load().then((obj) => {
      this.object = obj;
      this.update();
    });
    this.boundingBox = this.createBoundingBox();
    this.rotationX = Math.PI / 2;
  }

  async load(): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync("/Game/models/paddle.gltf");
    loadedData.scene.scale.set(0.1, 0.1, 0.1);
    loadedData.scene.position.set(this.position.x, this.position.y, this.position.z);
    loadedData.scene.rotation.set(0, this.rotationX, 0);

    loadedData.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.receiveShadow = true;
      }
    });

    this.scene.add(loadedData.scene);
    return loadedData.scene;
  }

  update(): void {
    this.object.position.set(this.position.x, this.position.y, this.position.z);
    this.boundingBox.position.set(this.position.x, this.position.y + 1, this.position.z);
    this.boundingBox.update();
  }

  createBoundingBox(): BoundingBox {
    const boundingBox = new BoundingBox(0.1, 2, 1.2, this.position, false);
    this.scene.add(boundingBox);
    return boundingBox;
  }

  getBoundingBoxArea(): number {
    return this.boundingBox.getArea();
  }

  checkCollision(ball: { min: Position; max: Position }): boolean | void {
    if (
      this.boundingBox.max.x > ball.min.x &&
      this.boundingBox.min.x < ball.max.x &&
      this.boundingBox.max.y > ball.min.y &&
      this.boundingBox.min.y < ball.max.y &&
      this.boundingBox.max.z > ball.min.z &&
      this.boundingBox.min.z < ball.max.z
    ) {
      return true;
    }
    return false;
  }

  getFrontPaddle(): number {
    return this.boundingBox.max.x;
  }

  getBackPaddle(): number {
    return this.boundingBox.min.x;
  }
}

export { Paddle as Paddle };
