import {
	BoxGeometry,
	BufferGeometry,
	CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Object3D, OctahedronGeometry, PlaneGeometry, Quaternion, Raycaster, SphereGeometry, TorusGeometry, Vector3
} from "three";


const _raycaster = new Raycaster();

const _tempVector = new Vector3();
const _tempVector2 = new Vector3();
const _tempQuaternion = new Quaternion();
const _unit = {
	X: new Vector3(1, 0, 0),
	Y: new Vector3(0, 1, 0),
	Z: new Vector3(0, 0, 1)
};

const _changeEvent = { type: 'change' };
const _mouseDownEvent = { type: 'mouseDown' };
const _mouseUpEvent = { type: 'mouseUp', mode: null };
const _objectChangeEvent = { type: 'objectChange' };

class TransformControls extends Object3D {

	/**
	 * @param {import("three").PerspectiveCamera} camera
	 * @param {Document | HTMLCanvasElement | undefined} domElement
	 */
	constructor(camera, domElement) {

		super();

		if (domElement === undefined) {

			console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.');
			domElement = document;

		}

		this.isTransformControls = true;

		this.visible = false;
		this.domElement = domElement;
		// @ts-ignore
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		const _gizmo = new TransformControlsGizmo();
		this._gizmo = _gizmo;
		// @ts-ignore
		this.add(_gizmo);

		const _plane = new TransformControlsPlane();
		this._plane = _plane;
		// @ts-ignore
		this.add(_plane);

		const scope = this;

		// Defined getter, setter and store for a property
		// @ts-ignore
		function defineProperty(propName, defaultValue) {

			let propValue = defaultValue;

			Object.defineProperty(scope, propName, {

				get: function () {

					return propValue !== undefined ? propValue : defaultValue;

				},

				set: function (value) {

					if (propValue !== value) {

						propValue = value;
						// @ts-ignore
						_plane[propName] = value;
						// @ts-ignore
						_gizmo[propName] = value;

						// @ts-ignore
						scope.dispatchEvent({ type: propName + '-changed', value: value });
						// @ts-ignore
						scope.dispatchEvent(_changeEvent);

					}

				}

			});

			// @ts-ignore
			scope[propName] = defaultValue;
			// @ts-ignore
			_plane[propName] = defaultValue;
			// @ts-ignore
			_gizmo[propName] = defaultValue;

		}

		// Define properties with getters/setter
		// Setting the defined property will automatically trigger change event
		// Defined properties are passed down to gizmo and plane

		defineProperty('camera', camera);
		defineProperty('object', undefined);
		defineProperty('enabled', true);
		defineProperty('axis', null);
		defineProperty('mode', 'translate');
		defineProperty('translationSnap', null);
		defineProperty('rotationSnap', null);
		defineProperty('scaleSnap', null);
		defineProperty('space', 'world');
		defineProperty('size', 1);
		defineProperty('dragging', false);
		defineProperty('showX', true);
		defineProperty('showY', true);
		defineProperty('showZ', true);

		// Reusable utility variables

		const worldPosition = new Vector3();
		const worldPositionStart = new Vector3();
		const worldQuaternion = new Quaternion();
		const worldQuaternionStart = new Quaternion();
		const cameraPosition = new Vector3();
		const cameraQuaternion = new Quaternion();
		const pointStart = new Vector3();
		const pointEnd = new Vector3();
		const rotationAxis = new Vector3();
		const rotationAngle = 0;
		const eye = new Vector3();

		// TODO: remove properties unused in plane and gizmo

		defineProperty('worldPosition', worldPosition);
		defineProperty('worldPositionStart', worldPositionStart);
		defineProperty('worldQuaternion', worldQuaternion);
		defineProperty('worldQuaternionStart', worldQuaternionStart);
		defineProperty('cameraPosition', cameraPosition);
		defineProperty('cameraQuaternion', cameraQuaternion);
		defineProperty('pointStart', pointStart);
		defineProperty('pointEnd', pointEnd);
		defineProperty('rotationAxis', rotationAxis);
		defineProperty('rotationAngle', rotationAngle);
		defineProperty('eye', eye);

		this._offset = new Vector3();
		this._startNorm = new Vector3();
		this._endNorm = new Vector3();
		this._cameraScale = new Vector3();

		this._parentPosition = new Vector3();
		this._parentQuaternion = new Quaternion();
		this._parentQuaternionInv = new Quaternion();
		this._parentScale = new Vector3();

		this._worldScaleStart = new Vector3();
		this._worldQuaternionInv = new Quaternion();
		this._worldScale = new Vector3();

		this._positionStart = new Vector3();
		this._quaternionStart = new Quaternion();
		this._scaleStart = new Vector3();

		this._getPointer = getPointer.bind(this);
		this._onPointerDown = onPointerDown.bind(this);
		this._onPointerHover = onPointerHover.bind(this);
		this._onPointerMove = onPointerMove.bind(this);
		this._onPointerUp = onPointerUp.bind(this);

		this.domElement.addEventListener('pointerdown', this._onPointerDown);
		this.domElement.addEventListener('pointermove', this._onPointerHover);
		this.domElement.addEventListener('pointerup', this._onPointerUp);

	}

	// updateMatrixWorld  updates key transformation variables
	updateMatrixWorld() {

		if (this.object !== undefined) {

			this.object.updateMatrixWorld();

			if (this.object.parent === null) {

				console.error('TransformControls: The attached 3D object must be a part of the scene graph.');

			} else {

				this.object.parent.matrixWorld.decompose(this._parentPosition, this._parentQuaternion, this._parentScale);

			}

			// @ts-ignore
			this.object.matrixWorld.decompose(this.worldPosition, this.worldQuaternion, this._worldScale);

			this._parentQuaternionInv.copy(this._parentQuaternion).invert();
			// @ts-ignore
			this._worldQuaternionInv.copy(this.worldQuaternion).invert();

		}

		// @ts-ignore
		this.camera.updateMatrixWorld();
		// @ts-ignore
		this.camera.matrixWorld.decompose(this.cameraPosition, this.cameraQuaternion, this._cameraScale);

		// @ts-ignore
		if (this.camera.isOrthographicCamera) {

			// @ts-ignore
			this.camera.getWorldDirection(this.eye);

		} else {

			// @ts-ignore
			this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize();

		}

		// @ts-ignore
		super.updateMatrixWorld(this);

	}

	// @ts-ignore
	pointerHover(pointer) {

		if (this.object === undefined || this.dragging === true) return;

		// @ts-ignore
		_raycaster.setFromCamera(pointer, this.camera);

		// @ts-ignore
		const intersect = intersectObjectWithRay(this._gizmo.picker[this.mode], _raycaster);

		if (intersect) {

			this.axis = intersect.object.name;

		} else {

			this.axis = null;

		}

	}

	// @ts-ignore
	pointerDown(pointer) {

		if (this.object === undefined || this.dragging === true || pointer.button !== 0) return;

		if (this.axis !== null) {

			// @ts-ignore
			_raycaster.setFromCamera(pointer, this.camera);

			const planeIntersect = intersectObjectWithRay(this._plane, _raycaster, true);

			if (planeIntersect) {

				this.object.updateMatrixWorld();
				this.object.parent.updateMatrixWorld();

				this._positionStart.copy(this.object.position);
				this._quaternionStart.copy(this.object.quaternion);
				this._scaleStart.copy(this.object.scale);

				// @ts-ignore
				this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart);

				// @ts-ignore
				this.pointStart.copy(planeIntersect.point).sub(this.worldPositionStart);

			}

			this.dragging = true;
			// @ts-ignore
			_mouseDownEvent.mode = this.mode;
			// @ts-ignore
			this.dispatchEvent(_mouseDownEvent);

		}

	}

	// @ts-ignore
	pointerMove(pointer) {

		const axis = this.axis;
		const mode = this.mode;
		const object = this.object;
		let space = this.space;

		if (mode === 'scale') {

			space = 'local';

		} else if (axis === 'E' || axis === 'XYZE' || axis === 'XYZ') {

			space = 'world';

		}

		if (object === undefined || axis === null || this.dragging === false || pointer.button !== - 1) return;

		// @ts-ignore
		_raycaster.setFromCamera(pointer, this.camera);

		const planeIntersect = intersectObjectWithRay(this._plane, _raycaster, true);

		if (!planeIntersect) return;

		// @ts-ignore
		this.pointEnd.copy(planeIntersect.point).sub(this.worldPositionStart);

		if (mode === 'translate') {

			// Apply translate

			// @ts-ignore
			this._offset.copy(this.pointEnd).sub(this.pointStart);

			if (space === 'local' && axis !== 'XYZ') {

				this._offset.applyQuaternion(this._worldQuaternionInv);

			}

			if (axis.indexOf('X') === - 1) this._offset.x = 0;
			if (axis.indexOf('Y') === - 1) this._offset.y = 0;
			if (axis.indexOf('Z') === - 1) this._offset.z = 0;

			if (space === 'local' && axis !== 'XYZ') {

				this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale);

			} else {

				this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale);

			}

			object.position.copy(this._offset).add(this._positionStart);

			// Apply translation snap

			if (this.translationSnap) {

				if (space === 'local') {

					object.position.applyQuaternion(_tempQuaternion.copy(this._quaternionStart).invert());

					if (axis.search('X') !== - 1) {

						object.position.x = Math.round(object.position.x / this.translationSnap) * this.translationSnap;

					}

					if (axis.search('Y') !== - 1) {

						object.position.y = Math.round(object.position.y / this.translationSnap) * this.translationSnap;

					}

					if (axis.search('Z') !== - 1) {

						object.position.z = Math.round(object.position.z / this.translationSnap) * this.translationSnap;

					}

					object.position.applyQuaternion(this._quaternionStart);

				}

				if (space === 'world') {

					if (object.parent) {

						object.position.add(_tempVector.setFromMatrixPosition(object.parent.matrixWorld));

					}

					if (axis.search('X') !== - 1) {

						object.position.x = Math.round(object.position.x / this.translationSnap) * this.translationSnap;

					}

					if (axis.search('Y') !== - 1) {

						object.position.y = Math.round(object.position.y / this.translationSnap) * this.translationSnap;

					}

					if (axis.search('Z') !== - 1) {

						object.position.z = Math.round(object.position.z / this.translationSnap) * this.translationSnap;

					}

					if (object.parent) {

						object.position.sub(_tempVector.setFromMatrixPosition(object.parent.matrixWorld));

					}

				}

			}

		} else if (mode === 'scale') {

			if (axis.search('XYZ') !== - 1) {

				// @ts-ignore
				let d = this.pointEnd.length() / this.pointStart.length();

				// @ts-ignore
				if (this.pointEnd.dot(this.pointStart) < 0) d *= - 1;

				_tempVector2.set(d, d, d);

			} else {

				// @ts-ignore
				_tempVector.copy(this.pointStart);
				// @ts-ignore
				_tempVector2.copy(this.pointEnd);

				_tempVector.applyQuaternion(this._worldQuaternionInv);
				_tempVector2.applyQuaternion(this._worldQuaternionInv);

				_tempVector2.divide(_tempVector);

				if (axis.search('X') === - 1) {

					_tempVector2.x = 1;

				}

				if (axis.search('Y') === - 1) {

					_tempVector2.y = 1;

				}

				if (axis.search('Z') === - 1) {

					_tempVector2.z = 1;

				}

			}

			// Apply scale

			object.scale.copy(this._scaleStart).multiply(_tempVector2);

			if (this.scaleSnap) {

				if (axis.search('X') !== - 1) {

					object.scale.x = Math.round(object.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap;

				}

				if (axis.search('Y') !== - 1) {

					object.scale.y = Math.round(object.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap;

				}

				if (axis.search('Z') !== - 1) {

					object.scale.z = Math.round(object.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap;

				}

			}

		} else if (mode === 'rotate') {

			// @ts-ignore
			this._offset.copy(this.pointEnd).sub(this.pointStart);

			// @ts-ignore
			const ROTATION_SPEED = 20 / this.worldPosition.distanceTo(_tempVector.setFromMatrixPosition(this.camera.matrixWorld));

			if (axis === 'E') {

				// @ts-ignore
				this.rotationAxis.copy(this.eye);
				// @ts-ignore
				this.rotationAngle = this.pointEnd.angleTo(this.pointStart);

				// @ts-ignore
				this._startNorm.copy(this.pointStart).normalize();
				// @ts-ignore
				this._endNorm.copy(this.pointEnd).normalize();

				// @ts-ignore
				this.rotationAngle *= (this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : - 1);

			} else if (axis === 'XYZE') {

				// @ts-ignore
				this.rotationAxis.copy(this._offset).cross(this.eye).normalize();
				// @ts-ignore
				this.rotationAngle = this._offset.dot(_tempVector.copy(this.rotationAxis).cross(this.eye)) * ROTATION_SPEED;

			} else if (axis === 'X' || axis === 'Y' || axis === 'Z') {

				// @ts-ignore
				this.rotationAxis.copy(_unit[axis]);

				// @ts-ignore
				_tempVector.copy(_unit[axis]);

				if (space === 'local') {

					// @ts-ignore
					_tempVector.applyQuaternion(this.worldQuaternion);

				}

				// @ts-ignore
				this.rotationAngle = this._offset.dot(_tempVector.cross(this.eye).normalize()) * ROTATION_SPEED;

			}

			// Apply rotation snap

			if (this.rotationSnap) this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap;

			// Apply rotate
			if (space === 'local' && axis !== 'E' && axis !== 'XYZE') {

				object.quaternion.copy(this._quaternionStart);
				// @ts-ignore
				object.quaternion.multiply(_tempQuaternion.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize();

			} else {

				// @ts-ignore
				this.rotationAxis.applyQuaternion(this._parentQuaternionInv);
				// @ts-ignore
				object.quaternion.copy(_tempQuaternion.setFromAxisAngle(this.rotationAxis, this.rotationAngle));
				object.quaternion.multiply(this._quaternionStart).normalize();

			}

		}

		// @ts-ignore
		this.dispatchEvent(_changeEvent);
		// @ts-ignore
		this.dispatchEvent(_objectChangeEvent);

	}

	// @ts-ignore
	pointerUp(pointer) {

		if (pointer.button !== 0) return;

		if (this.dragging && (this.axis !== null)) {

			_mouseUpEvent.mode = this.mode;
			// @ts-ignore
			this.dispatchEvent(_mouseUpEvent);

		}

		this.dragging = false;
		this.axis = null;

	}

	dispose() {

		this.domElement.removeEventListener('pointerdown', this._onPointerDown);
		this.domElement.removeEventListener('pointermove', this._onPointerHover);
		this.domElement.removeEventListener('pointermove', this._onPointerMove);
		this.domElement.removeEventListener('pointerup', this._onPointerUp);

		// @ts-ignore
		this.traverse(function (child) {

			// @ts-ignore
			if (child.geometry) child.geometry.dispose();
			// @ts-ignore
			if (child.material) child.material.dispose();

		});

	}

	// Set current object
	// @ts-ignore
	attach(object) {

		this.object = object;
		this.visible = true;

		return this;

	}

	// Detatch from object
	detach() {

		this.object = undefined;
		this.visible = false;
		this.axis = null;

		return this;

	}

	reset() {

		// @ts-ignore
		if (!this.enabled) return;

		if (this.dragging) {

			this.object.position.copy(this._positionStart);
			this.object.quaternion.copy(this._quaternionStart);
			this.object.scale.copy(this._scaleStart);

			// @ts-ignore
			this.dispatchEvent(_changeEvent);
			// @ts-ignore
			this.dispatchEvent(_objectChangeEvent);

			// @ts-ignore
			this.pointStart.copy(this.pointEnd);

		}

	}

	getRaycaster() {

		return _raycaster;

	}

	// TODO: deprecate

	getMode() {

		return this.mode;

	}

	// @ts-ignore
	setMode(mode) {

		this.mode = mode;

	}

	// @ts-ignore
	setTranslationSnap(translationSnap) {

		this.translationSnap = translationSnap;

	}

	// @ts-ignore
	setRotationSnap(rotationSnap) {

		this.rotationSnap = rotationSnap;

	}

	// @ts-ignore
	setScaleSnap(scaleSnap) {

		this.scaleSnap = scaleSnap;

	}

	// @ts-ignore
	setSize(size) {

		this.size = size;

	}

	// @ts-ignore
	setSpace(space) {

		this.space = space;

	}

	update() {

		console.warn('THREE.TransformControls: update function has no more functionality and therefore has been deprecated.');

	}

}

// mouse / touch event handlers

// @ts-ignore
function getPointer(event) {

	// @ts-ignore
	if (this.domElement.ownerDocument.pointerLockElement) {

		return {
			x: 0,
			y: 0,
			button: event.button
		};

	} else {

		// @ts-ignore
		const rect = this.domElement.getBoundingClientRect();

		return {
			x: (event.clientX - rect.left) / rect.width * 2 - 1,
			y: - (event.clientY - rect.top) / rect.height * 2 + 1,
			button: event.button
		};

	}

}

// @ts-ignore
function onPointerHover(event) {

	// @ts-ignore
	if (!this.enabled) return;

	switch (event.pointerType) {

		case 'mouse':
		case 'pen':
			// @ts-ignore
			this.pointerHover(this._getPointer(event));
			break;

	}

}

// @ts-ignore
function onPointerDown(event) {

	// @ts-ignore
	if (!this.enabled) return;

	if (!document.pointerLockElement) {

		// @ts-ignore
		this.domElement.setPointerCapture(event.pointerId);

	}

	// @ts-ignore
	this.domElement.addEventListener('pointermove', this._onPointerMove);

	// @ts-ignore
	this.pointerHover(this._getPointer(event));
	// @ts-ignore
	this.pointerDown(this._getPointer(event));

}

// @ts-ignore
function onPointerMove(event) {

	// @ts-ignore
	if (!this.enabled) return;

	// @ts-ignore
	this.pointerMove(this._getPointer(event));

}

// @ts-ignore
function onPointerUp(event) {

	// @ts-ignore
	if (!this.enabled) return;

	// @ts-ignore
	this.domElement.releasePointerCapture(event.pointerId);

	// @ts-ignore
	this.domElement.removeEventListener('pointermove', this._onPointerMove);

	// @ts-ignore
	this.pointerUp(this._getPointer(event));

}

// @ts-ignore
function intersectObjectWithRay(object, raycaster, includeInvisible) {

	const allIntersections = raycaster.intersectObject(object, true);

	for (let i = 0; i < allIntersections.length; i++) {

		if (allIntersections[i].object.visible || includeInvisible) {

			return allIntersections[i];

		}

	}

	return false;

}

//

// Reusable utility variables

const _tempEuler = new Euler();
const _alignVector = new Vector3(0, 1, 0);
const _zeroVector = new Vector3(0, 0, 0);
const _lookAtMatrix = new Matrix4();
const _tempQuaternion2 = new Quaternion();
const _identityQuaternion = new Quaternion();
const _dirVector = new Vector3();
const _tempMatrix = new Matrix4();

const _unitX = new Vector3(1, 0, 0);
const _unitY = new Vector3(0, 1, 0);
const _unitZ = new Vector3(0, 0, 1);

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

class TransformControlsGizmo extends Object3D {

	constructor() {

		super();

		this.isTransformControlsGizmo = true;

		this.type = 'TransformControlsGizmo';

		// shared materials

		const gizmoMaterial = new MeshBasicMaterial({
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true
		});

		const gizmoLineMaterial = new LineBasicMaterial({
			depthTest: false,
			depthWrite: false,
			// @ts-ignore
			fog: false,
			toneMapped: false,
			transparent: true
		});

		// Make unique material for each axis/color

		const matInvisible = gizmoMaterial.clone();
		matInvisible.opacity = 0.15;

		const matHelper = gizmoLineMaterial.clone();
		matHelper.opacity = 0.5;

		const matRed = gizmoMaterial.clone();
		matRed.color.setHex(0xff0000);

		const matGreen = gizmoMaterial.clone();
		matGreen.color.setHex(0x00ff00);

		const matBlue = gizmoMaterial.clone();
		matBlue.color.setHex(0x0000ff);

		const matRedTransparent = gizmoMaterial.clone();
		matRedTransparent.color.setHex(0xff0000);
		matRedTransparent.opacity = 0.5;

		const matGreenTransparent = gizmoMaterial.clone();
		matGreenTransparent.color.setHex(0x00ff00);
		matGreenTransparent.opacity = 0.5;

		const matBlueTransparent = gizmoMaterial.clone();
		matBlueTransparent.color.setHex(0x0000ff);
		matBlueTransparent.opacity = 0.5;

		const matWhiteTransparent = gizmoMaterial.clone();
		matWhiteTransparent.opacity = 0.25;

		const matYellowTransparent = gizmoMaterial.clone();
		matYellowTransparent.color.setHex(0xffff00);
		matYellowTransparent.opacity = 0.25;

		const matYellow = gizmoMaterial.clone();
		matYellow.color.setHex(0xffff00);

		const matGray = gizmoMaterial.clone();
		matGray.color.setHex(0x787878);

		// reusable geometry

		const arrowGeometry = new CylinderGeometry(0, 0.04, 0.1, 12);
		arrowGeometry.translate(0, 0.05, 0);

		const scaleHandleGeometry = new BoxGeometry(0.08, 0.08, 0.08);
		scaleHandleGeometry.translate(0, 0.04, 0);

		const lineGeometry = new BufferGeometry();
		lineGeometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

		const lineGeometry2 = new CylinderGeometry(0.0075, 0.0075, 0.5, 3);
		lineGeometry2.translate(0, 0.25, 0);

		// @ts-ignore
		function CircleGeometry(radius, arc) {

			const geometry = new TorusGeometry(radius, 0.0075, 3, 64, arc * Math.PI * 2);
			geometry.rotateY(Math.PI / 2);
			geometry.rotateX(Math.PI / 2);
			return geometry;

		}

		// Special geometry for transform helper. If scaled with position vector it spans from [0,0,0] to position

		function TranslateHelperGeometry() {

			const geometry = new BufferGeometry();

			geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 1, 1], 3));

			return geometry;

		}

		// Gizmo definitions - custom hierarchy definitions for setupGizmo() function

		const gizmoTranslate = {
			X: [
				[new Mesh(arrowGeometry, matRed), [0.5, 0, 0], [0, 0, - Math.PI / 2]],
				[new Mesh(arrowGeometry, matRed), [- 0.5, 0, 0], [0, 0, Math.PI / 2]],
				[new Mesh(lineGeometry2, matRed), [0, 0, 0], [0, 0, - Math.PI / 2]]
			],
			Y: [
				[new Mesh(arrowGeometry, matGreen), [0, 0.5, 0]],
				[new Mesh(arrowGeometry, matGreen), [0, - 0.5, 0], [Math.PI, 0, 0]],
				[new Mesh(lineGeometry2, matGreen)]
			],
			Z: [
				[new Mesh(arrowGeometry, matBlue), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
				[new Mesh(arrowGeometry, matBlue), [0, 0, - 0.5], [- Math.PI / 2, 0, 0]],
				[new Mesh(lineGeometry2, matBlue), null, [Math.PI / 2, 0, 0]]
			],
			XYZ: [
				[new Mesh(new OctahedronGeometry(0.1, 0), matWhiteTransparent.clone()), [0, 0, 0]]
			],
			XY: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matBlueTransparent.clone()), [0.15, 0.15, 0]]
			],
			YZ: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matRedTransparent.clone()), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
			],
			XZ: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matGreenTransparent.clone()), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]]
			]
		};

		const pickerTranslate = {
			X: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0.3, 0, 0], [0, 0, - Math.PI / 2]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [- 0.3, 0, 0], [0, 0, Math.PI / 2]]
			],
			Y: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0.3, 0]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, - 0.3, 0], [0, 0, Math.PI]]
			],
			Z: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, - 0.3], [- Math.PI / 2, 0, 0]]
			],
			XYZ: [
				[new Mesh(new OctahedronGeometry(0.2, 0), matInvisible)]
			],
			XY: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0.15, 0]]
			],
			YZ: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
			],
			XZ: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]]
			]
		};

		const helperTranslate = {
			START: [
				[new Mesh(new OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']
			],
			END: [
				[new Mesh(new OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']
			],
			DELTA: [
				[new Line(TranslateHelperGeometry(), matHelper), null, null, null, 'helper']
			],
			X: [
				[new Line(lineGeometry, matHelper.clone()), [- 1e3, 0, 0], null, [1e6, 1, 1], 'helper']
			],
			Y: [
				[new Line(lineGeometry, matHelper.clone()), [0, - 1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper']
			],
			Z: [
				[new Line(lineGeometry, matHelper.clone()), [0, 0, - 1e3], [0, - Math.PI / 2, 0], [1e6, 1, 1], 'helper']
			]
		};

		const gizmoRotate = {
			XYZE: [
				[new Mesh(CircleGeometry(0.5, 1), matGray), null, [0, Math.PI / 2, 0]]
			],
			X: [
				[new Mesh(CircleGeometry(0.5, 0.5), matRed)]
			],
			Y: [
				[new Mesh(CircleGeometry(0.5, 0.5), matGreen), null, [0, 0, - Math.PI / 2]]
			],
			Z: [
				[new Mesh(CircleGeometry(0.5, 0.5), matBlue), null, [0, Math.PI / 2, 0]]
			],
			E: [
				[new Mesh(CircleGeometry(0.75, 1), matYellowTransparent), null, [0, Math.PI / 2, 0]]
			]
		};

		const helperRotate = {
			AXIS: [
				[new Line(lineGeometry, matHelper.clone()), [- 1e3, 0, 0], null, [1e6, 1, 1], 'helper']
			]
		};

		const pickerRotate = {
			XYZE: [
				[new Mesh(new SphereGeometry(0.25, 10, 8), matInvisible)]
			],
			X: [
				[new Mesh(new TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, - Math.PI / 2, - Math.PI / 2]],
			],
			Y: [
				[new Mesh(new TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [Math.PI / 2, 0, 0]],
			],
			Z: [
				[new Mesh(new TorusGeometry(0.5, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, 0, - Math.PI / 2]],
			],
			E: [
				[new Mesh(new TorusGeometry(0.75, 0.1, 2, 24), matInvisible)]
			]
		};

		const gizmoScale = {
			X: [
				[new Mesh(scaleHandleGeometry, matRed), [0.5, 0, 0], [0, 0, - Math.PI / 2]],
				[new Mesh(lineGeometry2, matRed), [0, 0, 0], [0, 0, - Math.PI / 2]],
				[new Mesh(scaleHandleGeometry, matRed), [- 0.5, 0, 0], [0, 0, Math.PI / 2]],
			],
			Y: [
				[new Mesh(scaleHandleGeometry, matGreen), [0, 0.5, 0]],
				[new Mesh(lineGeometry2, matGreen)],
				[new Mesh(scaleHandleGeometry, matGreen), [0, - 0.5, 0], [0, 0, Math.PI]],
			],
			Z: [
				[new Mesh(scaleHandleGeometry, matBlue), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
				[new Mesh(lineGeometry2, matBlue), [0, 0, 0], [Math.PI / 2, 0, 0]],
				[new Mesh(scaleHandleGeometry, matBlue), [0, 0, - 0.5], [- Math.PI / 2, 0, 0]]
			],
			XY: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matBlueTransparent), [0.15, 0.15, 0]]
			],
			YZ: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matRedTransparent), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
			],
			XZ: [
				[new Mesh(new BoxGeometry(0.15, 0.15, 0.01), matGreenTransparent), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]]
			],
			XYZ: [
				[new Mesh(new BoxGeometry(0.1, 0.1, 0.1), matWhiteTransparent.clone())],
			]
		};

		const pickerScale = {
			X: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0.3, 0, 0], [0, 0, - Math.PI / 2]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [- 0.3, 0, 0], [0, 0, Math.PI / 2]]
			],
			Y: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0.3, 0]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, - 0.3, 0], [0, 0, Math.PI]]
			],
			Z: [
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
				[new Mesh(new CylinderGeometry(0.2, 0, 0.6, 4), matInvisible), [0, 0, - 0.3], [- Math.PI / 2, 0, 0]]
			],
			XY: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0.15, 0]],
			],
			YZ: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0, 0.15, 0.15], [0, Math.PI / 2, 0]],
			],
			XZ: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.01), matInvisible), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]],
			],
			XYZ: [
				[new Mesh(new BoxGeometry(0.2, 0.2, 0.2), matInvisible), [0, 0, 0]],
			]
		};

		const helperScale = {
			X: [
				[new Line(lineGeometry, matHelper.clone()), [- 1e3, 0, 0], null, [1e6, 1, 1], 'helper']
			],
			Y: [
				[new Line(lineGeometry, matHelper.clone()), [0, - 1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper']
			],
			Z: [
				[new Line(lineGeometry, matHelper.clone()), [0, 0, - 1e3], [0, - Math.PI / 2, 0], [1e6, 1, 1], 'helper']
			]
		};

		// Creates an Object3D with gizmos described in custom hierarchy definition.

		// @ts-ignore
		function setupGizmo(gizmoMap) {

			const gizmo = new Object3D();

			for (const name in gizmoMap) {

				for (let i = gizmoMap[name].length; i--;) {

					const object = gizmoMap[name][i][0].clone();
					const position = gizmoMap[name][i][1];
					const rotation = gizmoMap[name][i][2];
					const scale = gizmoMap[name][i][3];
					const tag = gizmoMap[name][i][4];

					// name and tag properties are essential for picking and updating logic.
					object.name = name;
					object.tag = tag;

					if (position) {

						object.position.set(position[0], position[1], position[2]);

					}

					if (rotation) {

						object.rotation.set(rotation[0], rotation[1], rotation[2]);

					}

					if (scale) {

						object.scale.set(scale[0], scale[1], scale[2]);

					}

					object.updateMatrix();

					const tempGeometry = object.geometry.clone();
					tempGeometry.applyMatrix4(object.matrix);
					object.geometry = tempGeometry;
					object.renderOrder = Infinity;

					object.position.set(0, 0, 0);
					object.rotation.set(0, 0, 0);
					object.scale.set(1, 1, 1);

					gizmo.add(object);

				}

			}

			return gizmo;

		}

		// Gizmo creation

		this.gizmo = {};
		this.picker = {};
		this.helper = {};

		// @ts-ignore
		this.add(this.gizmo['translate'] = setupGizmo(gizmoTranslate));
		// @ts-ignore
		this.add(this.gizmo['rotate'] = setupGizmo(gizmoRotate));
		// @ts-ignore
		this.add(this.gizmo['scale'] = setupGizmo(gizmoScale));
		// @ts-ignore
		this.add(this.picker['translate'] = setupGizmo(pickerTranslate));
		// @ts-ignore
		this.add(this.picker['rotate'] = setupGizmo(pickerRotate));
		// @ts-ignore
		this.add(this.picker['scale'] = setupGizmo(pickerScale));
		// @ts-ignore
		this.add(this.helper['translate'] = setupGizmo(helperTranslate));
		// @ts-ignore
		this.add(this.helper['rotate'] = setupGizmo(helperRotate));
		// @ts-ignore
		this.add(this.helper['scale'] = setupGizmo(helperScale));

		// Pickers should be hidden always

		// @ts-ignore
		this.picker['translate'].visible = false;
		// @ts-ignore
		this.picker['rotate'].visible = false;
		// @ts-ignore
		this.picker['scale'].visible = false;

	}

	// updateMatrixWorld will update transformations and appearance of individual handles

	// @ts-ignore
	updateMatrixWorld(force) {

		// @ts-ignore
		const space = (this.mode === 'scale') ? 'local' : this.space; // scale always oriented to local rotation

		// @ts-ignore
		const quaternion = (space === 'local') ? this.worldQuaternion : _identityQuaternion;

		// Show only gizmos for current transform mode

		// @ts-ignore
		this.gizmo['translate'].visible = this.mode === 'translate';
		// @ts-ignore
		this.gizmo['rotate'].visible = this.mode === 'rotate';
		// @ts-ignore
		this.gizmo['scale'].visible = this.mode === 'scale';

		// @ts-ignore
		this.helper['translate'].visible = this.mode === 'translate';
		// @ts-ignore
		this.helper['rotate'].visible = this.mode === 'rotate';
		// @ts-ignore
		this.helper['scale'].visible = this.mode === 'scale';


		// @ts-ignore
		let handles = [];
		// @ts-ignore
		handles = handles.concat(this.picker[this.mode].children);
		// @ts-ignore
		handles = handles.concat(this.gizmo[this.mode].children);
		// @ts-ignore
		handles = handles.concat(this.helper[this.mode].children);

		for (let i = 0; i < handles.length; i++) {

			const handle = handles[i];

			// hide aligned to camera

			handle.visible = true;
			handle.rotation.set(0, 0, 0);
			// @ts-ignore
			handle.position.copy(this.worldPosition);

			let factor;

			// @ts-ignore
			if (this.camera.isOrthographicCamera) {

				// @ts-ignore
				factor = (this.camera.top - this.camera.bottom) / this.camera.zoom;

			} else {

				// @ts-ignore
				factor = this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7);

			}

			// @ts-ignore
			handle.scale.set(1, 1, 1).multiplyScalar(factor * this.size / 4);

			// TODO: simplify helpers and consider decoupling from gizmo

			if (handle.tag === 'helper') {

				handle.visible = false;

				if (handle.name === 'AXIS') {

					// @ts-ignore
					handle.position.copy(this.worldPositionStart);
					// @ts-ignore
					handle.visible = !!this.axis;

					// @ts-ignore
					if (this.axis === 'X') {

						_tempQuaternion.setFromEuler(_tempEuler.set(0, 0, 0));
						handle.quaternion.copy(quaternion).multiply(_tempQuaternion);

						// @ts-ignore
						if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {

							handle.visible = false;

						}

					}

					// @ts-ignore
					if (this.axis === 'Y') {

						_tempQuaternion.setFromEuler(_tempEuler.set(0, 0, Math.PI / 2));
						handle.quaternion.copy(quaternion).multiply(_tempQuaternion);

						// @ts-ignore
						if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {

							handle.visible = false;

						}

					}

					// @ts-ignore
					if (this.axis === 'Z') {

						_tempQuaternion.setFromEuler(_tempEuler.set(0, Math.PI / 2, 0));
						handle.quaternion.copy(quaternion).multiply(_tempQuaternion);

						// @ts-ignore
						if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) > 0.9) {

							handle.visible = false;

						}

					}

					// @ts-ignore
					if (this.axis === 'XYZE') {

						_tempQuaternion.setFromEuler(_tempEuler.set(0, Math.PI / 2, 0));
						// @ts-ignore
						_alignVector.copy(this.rotationAxis);
						handle.quaternion.setFromRotationMatrix(_lookAtMatrix.lookAt(_zeroVector, _alignVector, _unitY));
						handle.quaternion.multiply(_tempQuaternion);
						// @ts-ignore
						handle.visible = this.dragging;

					}

					// @ts-ignore
					if (this.axis === 'E') {

						handle.visible = false;

					}


				} else if (handle.name === 'START') {

					// @ts-ignore
					handle.position.copy(this.worldPositionStart);
					// @ts-ignore
					handle.visible = this.dragging;

				} else if (handle.name === 'END') {

					// @ts-ignore
					handle.position.copy(this.worldPosition);
					// @ts-ignore
					handle.visible = this.dragging;

				} else if (handle.name === 'DELTA') {

					// @ts-ignore
					handle.position.copy(this.worldPositionStart);
					// @ts-ignore
					handle.quaternion.copy(this.worldQuaternionStart);
					// @ts-ignore
					_tempVector.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(- 1);
					// @ts-ignore
					_tempVector.applyQuaternion(this.worldQuaternionStart.clone().invert());
					handle.scale.copy(_tempVector);
					// @ts-ignore
					handle.visible = this.dragging;

				} else {

					handle.quaternion.copy(quaternion);

					// @ts-ignore
					if (this.dragging) {

						// @ts-ignore
						handle.position.copy(this.worldPositionStart);

					} else {

						// @ts-ignore
						handle.position.copy(this.worldPosition);

					}

					// @ts-ignore
					if (this.axis) {

						// @ts-ignore
						handle.visible = this.axis.search(handle.name) !== - 1;

					}

				}

				// If updating helper, skip rest of the loop
				continue;

			}

			// Align handles to current local or world rotation

			handle.quaternion.copy(quaternion);

			// @ts-ignore
			if (this.mode === 'translate' || this.mode === 'scale') {

				// Hide translate and scale axis facing the camera

				const AXIS_HIDE_TRESHOLD = 0.99;
				const PLANE_HIDE_TRESHOLD = 0.2;

				if (handle.name === 'X') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				if (handle.name === 'Y') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				if (handle.name === 'Z') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) > AXIS_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				if (handle.name === 'XY') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitZ).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				if (handle.name === 'YZ') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitX).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				if (handle.name === 'XZ') {

					// @ts-ignore
					if (Math.abs(_alignVector.copy(_unitY).applyQuaternion(quaternion).dot(this.eye)) < PLANE_HIDE_TRESHOLD) {

						handle.scale.set(1e-10, 1e-10, 1e-10);
						handle.visible = false;

					}

				}

				// @ts-ignore
			} else if (this.mode === 'rotate') {

				// Align handles to current local or world rotation

				_tempQuaternion2.copy(quaternion);
				// @ts-ignore
				_alignVector.copy(this.eye).applyQuaternion(_tempQuaternion.copy(quaternion).invert());

				if (handle.name.search('E') !== - 1) {

					// @ts-ignore
					handle.quaternion.setFromRotationMatrix(_lookAtMatrix.lookAt(this.eye, _zeroVector, _unitY));

				}

				if (handle.name === 'X') {

					_tempQuaternion.setFromAxisAngle(_unitX, Math.atan2(- _alignVector.y, _alignVector.z));
					_tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
					handle.quaternion.copy(_tempQuaternion);

				}

				if (handle.name === 'Y') {

					_tempQuaternion.setFromAxisAngle(_unitY, Math.atan2(_alignVector.x, _alignVector.z));
					_tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
					handle.quaternion.copy(_tempQuaternion);

				}

				if (handle.name === 'Z') {

					_tempQuaternion.setFromAxisAngle(_unitZ, Math.atan2(_alignVector.y, _alignVector.x));
					_tempQuaternion.multiplyQuaternions(_tempQuaternion2, _tempQuaternion);
					handle.quaternion.copy(_tempQuaternion);

				}

			}

			// Hide disabled axes
			// @ts-ignore
			handle.visible = handle.visible && (handle.name.indexOf('X') === - 1 || this.showX);
			// @ts-ignore
			handle.visible = handle.visible && (handle.name.indexOf('Y') === - 1 || this.showY);
			// @ts-ignore
			handle.visible = handle.visible && (handle.name.indexOf('Z') === - 1 || this.showZ);
			// @ts-ignore
			handle.visible = handle.visible && (handle.name.indexOf('E') === - 1 || (this.showX && this.showY && this.showZ));

			// highlight selected axis

			handle.material._color = handle.material._color || handle.material.color.clone();
			handle.material._opacity = handle.material._opacity || handle.material.opacity;

			handle.material.color.copy(handle.material._color);
			handle.material.opacity = handle.material._opacity;

			// @ts-ignore
			if (this.enabled && this.axis) {

				// @ts-ignore
				if (handle.name === this.axis) {

					handle.material.color.setHex(0xffff00);
					handle.material.opacity = 1.0;

					// @ts-ignore
				} else if (this.axis.split('').some(function (a) {

					return handle.name === a;

				})) {

					handle.material.color.setHex(0xffff00);
					handle.material.opacity = 1.0;

				}

			}

		}

		super.updateMatrixWorld(force);

	}

}

//

class TransformControlsPlane extends Mesh {

	constructor() {

		super(
			new PlaneGeometry(100000, 100000, 2, 2),
			new MeshBasicMaterial({ visible: false, wireframe: true, side: DoubleSide, transparent: true, opacity: 0.1, toneMapped: false })
		);

		this.isTransformControlsPlane = true;

		this.type = 'TransformControlsPlane';

	}

	// @ts-ignore
	updateMatrixWorld(force) {

		// @ts-ignore
		let space = this.space;

		// @ts-ignore
		this.position.copy(this.worldPosition);

		// @ts-ignore
		if (this.mode === 'scale') space = 'local'; // scale always oriented to local rotation

		// @ts-ignore
		_v1.copy(_unitX).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);
		// @ts-ignore
		_v2.copy(_unitY).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);
		// @ts-ignore
		_v3.copy(_unitZ).applyQuaternion(space === 'local' ? this.worldQuaternion : _identityQuaternion);

		// Align the plane for current transform mode, axis and space.

		_alignVector.copy(_v2);

		// @ts-ignore
		switch (this.mode) {

			case 'translate':
			case 'scale':
				// @ts-ignore
				switch (this.axis) {

					case 'X':
						// @ts-ignore
						_alignVector.copy(this.eye).cross(_v1);
						_dirVector.copy(_v1).cross(_alignVector);
						break;
					case 'Y':
						// @ts-ignore
						_alignVector.copy(this.eye).cross(_v2);
						_dirVector.copy(_v2).cross(_alignVector);
						break;
					case 'Z':
						// @ts-ignore
						_alignVector.copy(this.eye).cross(_v3);
						_dirVector.copy(_v3).cross(_alignVector);
						break;
					case 'XY':
						_dirVector.copy(_v3);
						break;
					case 'YZ':
						_dirVector.copy(_v1);
						break;
					case 'XZ':
						_alignVector.copy(_v3);
						_dirVector.copy(_v2);
						break;
					case 'XYZ':
					case 'E':
						_dirVector.set(0, 0, 0);
						break;

				}

				break;
			case 'rotate':
			default:
				// special case for rotate
				_dirVector.set(0, 0, 0);

		}

		if (_dirVector.length() === 0) {

			// If in rotate mode, make the plane parallel to camera
			// @ts-ignore
			this.quaternion.copy(this.cameraQuaternion);

		} else {

			_tempMatrix.lookAt(_tempVector.set(0, 0, 0), _dirVector, _alignVector);

			// @ts-ignore
			this.quaternion.setFromRotationMatrix(_tempMatrix);

		}

		super.updateMatrixWorld(force);

	}

}

export { TransformControls, TransformControlsGizmo, TransformControlsPlane };