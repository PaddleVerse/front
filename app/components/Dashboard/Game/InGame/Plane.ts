import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
  z: number;
}

class Plane extends THREE.Mesh {
  height: number;
  width: number;
  boundingBox: THREE.Box3;

  constructor(
    height: number = 1,
    width: number = 1,
    position: Position = { x: 0, y: 0, z: 0 },
    rotationX: number = -Math.PI / 2,
    texture: string = 'textures/plane.jpg',
  ) {
    const geometry = new THREE.PlaneGeometry(height, width);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(texture),
    });

    super(geometry, material);

    this.rotation.x = rotationX;
    this.position.set(position.x, position.y, position.z);

    // Correctly typing the material to MeshStandardMaterial
    if ((this.material as THREE.MeshStandardMaterial).map) {
      const standardMaterial = this.material as THREE.MeshStandardMaterial;
      if (standardMaterial.map) {
        standardMaterial.map.wrapS = THREE.RepeatWrapping;
        standardMaterial.map.wrapT = THREE.RepeatWrapping;
        standardMaterial.map.repeat.set(20, 20);
      }
      
    }

    this.height = height;
    this.width = width;
    this.receiveShadow = true;

    // Bounding box
    const bbox = new THREE.Box3().setFromObject(this);
    this.boundingBox = bbox;
  }
}

export { Plane };
