import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js"

let THREECAMERA = null

const exporter = new GLTFExporter()

// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
    if (isDetected) {
        console.log("INFO in detect_callback(): DETECTED")
    } else {
        console.log("INFO in detect_callback(): LOST")
    }
}

function save(blob, filename) {
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
    save(
        new Blob([text], {
            type: "text/plain",
        }),
        filename
    )
}

const link = document.createElement("a")
link.style.display = "none"
document.body.appendChild(link) // Firefox workaround, see #6594

let faceMesh
let threeStuffs

function exportModel(model) {
    const exporter = new GLTFExporter()
    // Parse the input and generate the glTF output

    exporter.parse(
        model,
        function (gltf) {
            const output = JSON.stringify(gltf, null, 2)
            saveString(output, "model.gltf")
        },
        {}
    )
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
    threeStuffs = JeelizThreeHelper.init(spec, detect_callback)

    // Add our face model:
    const loader = new THREE.BufferGeometryLoader()

    loader.load("./models/face.json", geometry => {
        const mat = new THREE.MeshBasicMaterial({
            // DEBUG: uncomment color, comment map and alphaMap
            map: new THREE.TextureLoader().load(
                "./models/vaccsFaceTextureEdit.png"
            ),
            //alphaMap: new THREE.TextureLoader().load('./models/football_makeup/alpha_map_256.png'),
            transparent: true,
            opacity: 0.23,
        })

        faceMesh = new THREE.Mesh(geometry, mat)
        faceMesh.position.y += 0.25
        faceMesh.position.z -= 0.19

        faceMesh.visible = false

        addDragEventListener(faceMesh)

        threeStuffs.faceObject.add(faceMesh)
    })

    /* setInterval(() => {
    console.log('faceobj: ', threeStuffs.faceObject)
    isFaceVerifyChanged();
  }, 500) */

    let faceDetected = false

    let posXLower = -0.5
    let posXUpper = 0.5
    let seenSmallest = 0
    let seenHighest = 0
    let faceCheckCount = 0
    let faceCheckLimit = 50
    let faceChecked = false

    let faceCheckInterval = setInterval(() => {
        verifyFace()
    }, 100)

    function verifyFace() {
        let faceObj = threeStuffs.faceObject

        console.log("rot: ", faceObj.rotation)

        console.log("mesh: ", faceObj)

        // set smallest
        if (faceObj.rotation.y < seenSmallest) {
            seenSmallest = faceObj.rotation.y
        }

        // set largest
        if (faceObj.rotation.y > seenHighest) {
            seenHighest = faceObj.rotation.y
        }

        faceCheckCount++

        //if (faceCheckCount > faceCheckLimit){
        if (seenHighest >= posXUpper && seenSmallest <= posXLower) {
            clearInterval(faceCheckInterval)

            console.log("seen highest: ", seenHighest)
            console.log("seen smallest: ", seenSmallest)

            //if (seenHighest >= posXUpper && seenSmallest <= posXLower) {
                postVerifiedMessage('verificationPassed')
                faceMesh.visible = true
           // }
        } else if (faceCheckCount > faceCheckLimit){
          console.log('TIMEOUT: Try again reload.')
          postVerifiedMessage('verificationFailed')
          clearInterval(faceCheckInterval)
        }
    }

    function postVerifiedMessage(msg) {
        //if (window.parent){

        let parent = window.parent
        console.log("PARENT: ", parent)
        console.log("sending msg...")
        parent.postMessage(msg, "*")
        /*  } else {
      console.log('NO PARENT WINDOW: Filter not being used as an iframe...')
    } */
    }
    // CREATE THE VIDEO BACKGROUND
    function create_mat2d(threeTexture, isTransparent) {
        //MT216 : we put the creation of the video material in a func because we will also use it for the frame
        return new THREE.RawShaderMaterial({
            depthWrite: false,
            depthTest: false,
            transparent: isTransparent,
            vertexShader:
                "attribute vec2 position;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position=vec4(position, 0., 1.);\n\
          vUV=0.5+0.5*position;\n\
        }",
            fragmentShader:
                "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_FragColor=texture2D(samplerVideo, vUV);\n\
        }",
            uniforms: {
                samplerVideo: { value: threeTexture },
            },
        })
    }

    /*   //MT216 : create the frame. We reuse the geometry of the video
  const calqueMesh = new THREE.Mesh(threeStuffs.videoMesh.geometry,  create_mat2d(new THREE.TextureLoader().load('./images/cadre_france.png'), true))
  calqueMesh.renderOrder = 999; // render last
  calqueMesh.frustumCulled = false;
  threeStuffs.scene.add(calqueMesh); */

    // CREATE THE CAMERA
    THREECAMERA = JeelizThreeHelper.create_camera()
} // end init_threeScene()

// Entry point:
function main() {
    JeelizResizer.size_canvas({
        canvasId: "jeeFaceFilterCanvas",
        callback: function (isError, bestVideoSettings) {
            init_faceFilter(bestVideoSettings)
        },
    })
}

function init_faceFilter(videoSettings) {
    JEELIZFACEFILTER.init({
        canvasId: "jeeFaceFilterCanvas",
        NNCPath: "./neural_nets/", // path of NN_DEFAULT.json file
        videoSettings: videoSettings,
        callbackReady: function (errCode, spec) {
            if (errCode) {
                console.log("AN ERROR HAPPENS. SORRY BRO :( . ERR =", errCode)
                return
            }

            console.log("INFO: JEELIZFACEFILTER IS READY")
            init_threeScene(spec)
        }, // end callbackReady()

        // called at each render iteration (drawing loop)
        callbackTrack: function (detectState) {
            JeelizThreeHelper.render(detectState, THREECAMERA)
        }, // end callbackTrack()
    }) // end JEELIZFACEFILTER.init call
}

//exporter();

/* window.addEventListener('message', (event) => {
  console.log('message recieved: ', event)

  if (event.data ==='takeImage'){
    console.log('take image message recv in iframe');

    let canvas = document.getElementById('jeeFaceFilterCanvas')
    //let canvasDataURL = canvas.toDataURL();

    canvas.toBlob((blob) => {
      const messageToPost = {
        id: 'iframeImage', 
        data: blob
      }
  
      window.parent.postMessage(messageToPost, '*')
    })

    

  }
})
 */
window.addEventListener("load", main)
