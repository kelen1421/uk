import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const palettes = {
  sculpture: [ ['#e59aa6', '珊瑚粉'], ['#a8abd4', '雾紫'], ['#b6c49b', '鼠尾草'] ],
  brand: [ ['#64765b', '森林绿'], ['#344553', '深海蓝'], ['#a57761', '陶土色'] ],
};

function sculpture() {
  const root = new THREE.Group();
  root.name = 'Soft Objects — concept sculpture';
  const material = new THREE.MeshPhysicalMaterial({ color: '#e59aa6', roughness: .21, metalness: .04, clearcoat: 1, clearcoatRoughness: .17 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(.94, .31, 180, 28, 2, 3), material);
  knot.rotation.set(.5, -.2, -.45);
  knot.scale.setScalar(.8);
  knot.position.x = -.65;
  knot.updateMatrixWorld();
  knot.position.y = -new THREE.Box3().setFromObject(knot, true).min.y + .04;
  knot.name = 'Inflated knot';
  root.add(knot);
  const ball = (r, mat, x, z) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), mat);
    mesh.position.set(x, r + .02, z); root.add(mesh); return mesh;
  };
  ball(.51, new THREE.MeshStandardMaterial({ color: '#e3e1de', metalness: 1, roughness: .12 }), 1.48, -.15).name = 'Chrome sphere';
  ball(.41, new THREE.MeshPhysicalMaterial({ color: '#eac4cd', transmission: .85, transparent: false, roughness: .08, thickness: .8, ior: 1.45, metalness: 0 }), .88, 1.15).name = 'Glass sphere';
  ball(.33, new THREE.MeshStandardMaterial({ color: '#b3c291', roughness: .9 }), -.38, -1.14).name = 'Foam sphere';
  return { root, accents: [material], background: '#edd8dd', color: index => material.color.set(palettes.sculpture[index][0]) };
}

function brandTexture(color, card = false) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = card ? 448 : 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = card ? color : '#ececdf'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = card ? '#f0f0df' : color;
  ctx.font = card ? '150px Georgia, serif' : '164px Georgia, serif';
  ctx.textAlign = 'center'; ctx.fillText('mori.', 384, card ? 208 : 240);
  ctx.font = '22px Arial, sans-serif'; ctx.fillText('森 日', 384, card ? 275 : 305);
  if (!card) {
    ctx.strokeStyle = color; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(383, 660); ctx.bezierCurveTo(235, 466, 298, 363, 404, 412); ctx.bezierCurveTo(522, 421, 479, 554, 383, 660); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(383, 660); ctx.lineTo(395, 414); ctx.moveTo(389, 565); ctx.lineTo(328, 491); ctx.moveTo(391, 514); ctx.lineTo(449, 473); ctx.stroke();
    ctx.fillStyle = color; ctx.fillRect(0, 782, 768, 242);
    ctx.fillStyle = '#eff1df'; ctx.font = '22px Arial, sans-serif'; ctx.fillText('THE ART OF SLOW LIVING', 384, 878);
    ctx.font = '14px Arial, sans-serif'; ctx.fillText('NATURAL GOODS · DAILY RITUALS', 384, 922);
  } else {
    ctx.font = '16px Arial, sans-serif'; ctx.fillText('EVERYDAY, NATURALLY.', 384, 362);
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function brand() {
  const root = new THREE.Group(); root.name = 'MORI — brand mockup';
  const color = palettes.brand[0][0];
  const paper = new THREE.MeshStandardMaterial({ color: '#ebeadd', roughness: .93 });
  const accent = new THREE.MeshStandardMaterial({ color, roughness: .78 });
  const front = new THREE.MeshStandardMaterial({ map: brandTexture(color), roughness: .87 });
  const cardFront = new THREE.MeshStandardMaterial({ map: brandTexture(color, true), roughness: .82 });
  const box = new THREE.Mesh(new RoundedBoxGeometry(1.55, 2.3, .72, 3, .025), [paper, paper, paper, paper, front, paper]);
  box.position.set(-1.03, 1.15, -.03); box.rotation.y = .2; box.name = 'Natural goods packaging'; root.add(box);
  const gift = new THREE.Mesh(new RoundedBoxGeometry(1.87, .6, 1.24, 3, .025), accent);
  gift.position.set(1.13, .32, -.3); gift.rotation.y = -.16; gift.name = 'Gift box'; root.add(gift);
  const giftTop = new THREE.Mesh(new THREE.PlaneGeometry(1.84, 1.2), new THREE.MeshStandardMaterial({ map: brandTexture(color, true), roughness: .9 }));
  giftTop.rotation.x = -Math.PI / 2; giftTop.rotation.z = -.16; giftTop.position.set(1.13, .626, -.3); root.add(giftTop);
  const card = new THREE.Mesh(new RoundedBoxGeometry(1.42, .032, .83, 2, .008), [paper, paper, cardFront, paper, paper, paper]);
  card.position.set(.65, .031, 1.2); card.rotation.y = -.25; card.name = 'Business card'; root.add(card);
  const tin = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .93, 48), accent);
  tin.position.set(1.75, .47, .82); tin.name = 'Tea tin'; root.add(tin);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.363, .363, .055, 48), paper);
  cap.position.set(1.75, .96, .82); root.add(cap);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(.26, 24, 16), new THREE.MeshStandardMaterial({ color: '#aebc8b', roughness: .9 }));
  leaf.scale.set(1.5, .055, .52); leaf.position.set(-1.6, .025, 1.17); leaf.rotation.y = -.5; root.add(leaf);
  const colorMaterials = [front, cardFront, giftTop.material];
  return {
    root, accents: [accent], background: '#dce1cf',
    color(index) {
      const next = palettes.brand[index][0]; accent.color.set(next);
      colorMaterials.forEach((mat, i) => { mat.map.dispose(); mat.map = brandTexture(next, i > 0); mat.needsUpdate = true; });
    },
  };
}

export function createModelViewer(host, type) {
  const isBrand = type === 'brand';
  host.innerHTML = `<div class="model-stage"><div class="model-stage-label"><span class="model-live-dot"></span>${isBrand ? '品牌立体样机' : '交互式 3D 模型'}<span class="model-concept">概念示例</span></div><div class="model-canvas" tabindex="0" role="img" aria-label="${isBrand ? 'MORI 品牌包装' : 'Soft Objects 雕塑'}立体模型，可拖动旋转或使用下方按钮操作"></div><div class="model-hint">拖动旋转 · 滚轮缩放 · 双指缩放</div></div><div class="model-toolbar"><div class="model-swatches" role="group" aria-label="模型配色">${palettes[type].map(([hex, label], i) => `<button class="model-swatch ${i === 0 ? 'selected' : ''}" style="--swatch:${hex}" data-color="${i}" aria-label="${label}" aria-pressed="${i === 0}"></button>`).join('')}</div><div class="model-actions"><button data-action="left" aria-label="向左旋转模型">↶</button><button data-action="right" aria-label="向右旋转模型">↷</button><span></span><button data-action="in" aria-label="放大模型">＋</button><button data-action="out" aria-label="缩小模型">−</button><span></span><button data-action="reset">复位</button><button data-action="wire" aria-pressed="false">线框</button></div></div><p class="model-caption">${isBrand ? '包装盒、礼盒、名片与茶罐，把品牌语言放进真实的空间。' : '从不同角度，观察形态、材质与光线的关系。'}</p>`;

  let renderer;
  const viewport = host.querySelector('.model-canvas');
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch {
    host.innerHTML = '<div class="model-unavailable"><p>当前浏览器未能开启立体预览。</p><span>可以切换到「平面预览」查看作品。</span></div>';
    return { dispose() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  viewport.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const model = isBrand ? brand() : sculpture();
  scene.background = new THREE.Color(model.background);
  scene.fog = new THREE.Fog(model.background, 15, 30);
  model.root.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
  scene.add(model.root);
  const room = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const env = generator.fromScene(room, .04);
  scene.environment = env.texture; scene.environmentIntensity = .6;
  room.dispose(); generator.dispose();
  scene.add(new THREE.HemisphereLight('#fff9f2', '#7c8270', 1.5));
  const light = new THREE.DirectionalLight('#fff8ee', 3.3); light.position.set(-3.5, 7, 5);
  light.castShadow = true; light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .1, far: 20 });
  light.shadow.normalBias = .035; light.shadow.bias = -.0001; scene.add(light);
  const fill = new THREE.DirectionalLight('#e5ecff', .8); fill.position.set(5, 3, -3); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: model.background, roughness: .96 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.025; ground.receiveShadow = true; scene.add(ground);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; controls.enablePan = false;
  controls.minDistance = 3.8; controls.maxDistance = 14;
  controls.minPolarAngle = .22; controls.maxPolarAngle = Math.PI / 2 - .02;
  controls.target.set(0, isBrand ? .8 : 1.1, 0);
  camera.position.set(isBrand ? 4.2 : 3.6, isBrand ? 3.6 : 3.4, isBrand ? 6.7 : 7.3);
  controls.update(); controls.saveState();
  let disposed = false;
  const render = () => {
    if (disposed || host.hidden || !host.isConnected || document.hidden) return;
    renderer.render(scene, camera);
    viewport.dataset.rendered = 'true';
    // DOM-visible state makes interaction verifiable without exposing renderer internals.
    viewport.dataset.view = `${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`;
  };
  controls.addEventListener('change', render);
  const resize = () => {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    if (!w || !h || disposed) return;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    render();
  };
  const observer = new ResizeObserver(resize); observer.observe(viewport);
  const onClick = event => {
    const swatch = event.target.closest('[data-color]');
    if (swatch) {
      model.color(Number(swatch.dataset.color));
      host.querySelectorAll('[data-color]').forEach(button => { const selected = button === swatch; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
      render();
    }
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === 'reset') controls.reset();
    if (action === 'left' || action === 'right') {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), action === 'left' ? -.25 : .25);
      camera.position.copy(controls.target).add(offset); controls.update();
    }
    if (action === 'in' || action === 'out') {
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * (action === 'in' ? .85 : 1.18), controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(distance)); controls.update();
    }
    if (action === 'wire') {
      const enabled = actionButton.getAttribute('aria-pressed') !== 'true'; actionButton.setAttribute('aria-pressed', String(enabled));
      model.root.traverse(object => { if (object.isMesh) for (const mat of [].concat(object.material)) mat.wireframe = enabled; });
    }
    render();
  };
  const onKeys = event => {
    const keys = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' };
    if (!keys[event.key]) return;
    event.preventDefault(); host.querySelector(`[data-action="${keys[event.key]}"]`).click();
  };
  const restore = event => { event.preventDefault(); viewport.dataset.rendered = 'false'; };
  const restored = () => { viewport.dataset.rendered = ''; resize(); };
  renderer.domElement.addEventListener('webglcontextlost', restore);
  renderer.domElement.addEventListener('webglcontextrestored', restored);
  host.addEventListener('click', onClick); viewport.addEventListener('keydown', onKeys);
  document.addEventListener('visibilitychange', render);
  resize();
  return {
    refresh: resize,
    dispose() {
      if (disposed) return; disposed = true;
      observer.disconnect(); controls.dispose();
      document.removeEventListener('visibilitychange', render); host.removeEventListener('click', onClick); viewport.removeEventListener('keydown', onKeys);
      const geometries = new Set(), materials = new Set(), textures = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) for (const mat of [].concat(object.material)) { materials.add(mat); for (const value of Object.values(mat)) if (value?.isTexture) textures.add(value); }
      });
      geometries.forEach(g => g.dispose()); textures.forEach(t => t.dispose()); materials.forEach(m => m.dispose());
      light.shadow.map?.dispose(); env.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
