function loadScene(){
  if( Meteor.THREE ){
    var THREE = Meteor.THREE;
    // revolutions per second
    var angularSpeed = 0.2; 
    var lastTime = 0;

    // this function is executed on each animation frame
    function animate(){
      // update
      var time = (new Date()).getTime();
      var timeDiff = time - lastTime;
      var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
      sphere.rotation.y += angleChange;
      lastTime = time;

      // render
      renderer.render(scene, camera);

      // request new frame
      requestAnimationFrame(function(){
          animate();
      });
    }

    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    // scene
    var scene = new THREE.Scene();

    // material
    var material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture('./sky.jpg')
    });
              
    // cube
    // var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), material);
    // cube.overdraw = true;
    // cube.rotation.x = Math.PI * 0.1;
    // scene.add(cube);
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), new THREE.MeshNormalMaterial());
    sphere.overdraw = true;
    scene.add(sphere);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // start animation
    animate();

    console.log('loaded')

  }else{
    console.log('try again', THREE)
    setTimeout(loadScene, 200);
  }
}

loadScene();