const textInput = document.getElementById('acol-textInput');
const addTextBtn = document.getElementById('acol-addTextBtn');
const deleteTextBtn = document.getElementById('acol-deleteTextBtn');
const resteBtn = document.getElementById('acol-reset');
const allSizeBtn = document.querySelectorAll('.acol-size-btn');
const allThicknessBtn = document.querySelectorAll('.acol-thickness-btn');
const downloadBtn = document.getElementById('acol-downloadBtn');
const collagePhoto = document.querySelector('.acol-collage-frame');
const iminus = document.getElementById('acol-iminus');
const iplus = document.getElementById('acol-iplus');
const fontFamilyOptions = document.getElementById('acol-fontStyleSelect');
let uploadedImagesCount = 0;
let totalImages = 0;
let activeTextBox = null;
const shareBtn = document.getElementById('acol-shareBtn');
const handles = document.querySelectorAll(".acol-resize, .acol-rotate");
const textModal = document.querySelector('.acol-textModal');

document.querySelectorAll(".acol-small-img, .acol-big-img").forEach((slot) => {
    totalImages = document.querySelectorAll(".acol-small-img, .acol-big-img").length;

    const input = slot.querySelector("input");
    const placeholder = slot.querySelector("p");
    const previewImage = slot.querySelector("img");

    slot.addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
                placeholder.style.display = "none";
                input.disabled = true;
                setActiveImage(previewImage);
                incrementUploadedImages();
            };
            reader.readAsDataURL(file);
        }
    });

    previewImage.addEventListener("click", () => {
        setActiveImage(previewImage);
    });

});

function incrementUploadedImages() {
    uploadedImagesCount++;
    if (totalImages === uploadedImagesCount) {
        downloadBtn.style.display = "block";
        shareBtn.style.display = "block";
    }
}

function setActiveImage(imageElement) {
    removeExistingHandles();
    makeDraggable(imageElement, { resize: 'acol-resize', rotate: 'acol-rotate' });
    addResizeHandle(imageElement);
    addRotateHandle(imageElement);
}

function removeExistingHandles() {
    document.querySelectorAll(".acol-resize, .acol-rotate").forEach((handle) => handle.remove());
}

function addResizeHandle(imageElement) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'acol-resize';
    resizeHandle.innerHTML = '+';

    collagePhoto.style.position = 'relative';
    collagePhoto.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const initialWidth = imageElement.offsetWidth;
        const initialMouseX = e.clientX;

        function resize(e) {
            const newWidth = initialWidth + (e.clientX - initialMouseX);
            imageElement.style.width = newWidth + 'px';
        }

        function stopResizing() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    });
}

function addRotateHandle(imageElement) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'acol-rotate';
    rotateHandle.innerHTML = '&#8635;';

    collagePhoto.style.position = 'relative';
    collagePhoto.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = imageElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = (angle * (180 / Math.PI)) % 360;
            imageElement.style.transform = `rotate(${degree}deg)`;
        }

        function stopRotating() {
            document.removeEventListener('mousemove', rotate);
            document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
    });
}

//=======================================================
// Add text functionality
//=======================================================

function updatePreview() {
    if (activeTextBox) {
        const text = document.getElementById('acol-textInput').value || 'New Custom Text';
        const textColor = document.getElementById('acol-textColor').value;

        activeTextBox.innerText = text;
        activeTextBox.style.color = textColor;
        attachHandles(activeTextBox);
        document.querySelectorAll('option').forEach(option => {
            option.textContent = `${text}`;
        });
    }
}

function attachHandles(element) {
    if (!element.querySelector('.acol-resize-handle')) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'acol-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '-11.3px';
        resizeHandle.style.bottom = '-6.5px';
        resizeHandle.style.fontSize = '24px';
        resizeHandle.style.cursor = 'crosshair';
        resizeHandle.innerText = '+';
        resizeHandle.style.display = 'none';

        element.appendChild(resizeHandle);

        resizeHandle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
            const initialMouseX = e.clientX;

            function resize(e) {
                const scaleFactor = 0.2;
                const newSize = initialFontSize + (e.clientX - initialMouseX) * scaleFactor;

                if (newSize > 10) {
                    element.style.fontSize = newSize + 'px';
                }
            }

            function stopResizing() {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResizing);
            }

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResizing);
        });
    }

    if (!element.querySelector('.acol-rotate-handle')) {
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'acol-rotate-handle';
        rotateHandle.style.position = 'absolute';
        rotateHandle.style.top = '-30px';
        rotateHandle.style.left = '50%';
        rotateHandle.style.transform = 'translateX(-50%)';
        rotateHandle.style.cursor = 'pointer';
        rotateHandle.style.fontSize = '24px';
        rotateHandle.innerHTML = '&#8635;';
        rotateHandle.style.display = 'none';

        element.appendChild(rotateHandle);

        rotateHandle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            function rotate(e) {
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const degree = (angle * (180 / Math.PI) + 90) % 360;
                element.style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
            }

            function stopRotating() {
                document.removeEventListener('mousemove', rotate);
                document.removeEventListener('mouseup', stopRotating);
            }

            document.addEventListener('mousemove', rotate);
            document.addEventListener('mouseup', stopRotating);
        });
    }
}

function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('click', function (e) {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle && rotateHandle) {
            resizeHandle.style.display = 'block';
            rotateHandle.style.display = 'block';
        }

        element.style.border = '2px dashed #248EE6';
    })
    element.addEventListener('mousedown', function (e) {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle && rotateHandle) {
            resizeHandle.style.display = 'block';
            rotateHandle.style.display = 'block';
        }
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';

    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';

            const resizeHandle = document.querySelector(`.${handle.resize}`);
            const rotateHandle = document.querySelector(`.${handle.rotate}`);

            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
        }
    });
}

addTextBtn.addEventListener('click', function () {
    textModal.style.display = 'flex';
    fontFamilyOptions.style.display = 'block';

    // Always create a new text box when clicking "Add Text"
    const textColor = document.getElementById('acol-textColor').value;
    const newTextBox = document.createElement('div');
    newTextBox.className = 'acol-text-box';
    newTextBox.innerText = 'New Custom Text';
    newTextBox.style.color = textColor;

    document.querySelector('.acol-collage-frame').appendChild(newTextBox);

    attachHandles(newTextBox);
    makeDraggable(newTextBox, { resize: 'acol-resize-handle', rotate: 'acol-rotate-handle' });

    // Update activeTextBox reference to the new one
    activeTextBox = newTextBox;
});


deleteTextBtn.addEventListener('click', function () {
    const previewText = document.querySelector('.acol-text-box.preview');
    if (previewText) previewText.remove();
    document.getElementById('acol-textInput').value = '';
    if (activeTextBox) {
        activeTextBox.remove();
        activeTextBox = null;
        document.getElementById('acol-textInput').value = '';
    }
    textModal.style.display = 'none';
    fontFamilyOptions.style.display = 'none';
    document.getElementById('acol-textColor').value = "#000000";
});

allSizeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('acol-active'));
        this.classList.add('acol-active');
    });
});

allThicknessBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allThicknessBtn.forEach(button => button.classList.remove('acol-active'));
        this.classList.add('acol-active');
    });
});

downloadBtn.addEventListener('click', () => {
    html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'customized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

iminus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize - 5) + 'px';
        attachHandles(activeTextBox);
    }
});

iplus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize + 5) + 'px';
        attachHandles(activeTextBox);
    }
});

function changeFontFamily() {
    const selectedFont = document.getElementById('acol-fontStyleSelect').value;
    if (activeTextBox) {
        activeTextBox.style.fontFamily = selectedFont;
    }
}

resteBtn.addEventListener('click', () => {
    location.reload();
});


function getImageDetails() {
    const imageContainers = document.querySelectorAll('.acol-small-img');
    const selectedBorder = document.querySelector('.acol-color-btn.active');
    const selectedShape = document.querySelector('.sacol-hape-btn.active');
    const selectedSize = document.querySelector('.acol-size-btn.active');
    const textElement = document.querySelector('.acol-text-box');

    let imagesData = [];

    imageContainers.forEach(container => {
        const imageElement = container.querySelector('.acol-previewImage');
        const fileInput = container.querySelector('input[type="file"]');
        const imageDetails = {
            name: imageElement.src ? imageElement.src.split('/').pop() : 'No image selected',
            size: fileInput.files.length ? fileInput.files[0].size : 'No file selected',
            type: fileInput.files.length ? fileInput.files[0].type : 'No file selected',
            width: imageElement ? imageElement.offsetWidth + 'px' : 'No image',
            height: imageElement ? imageElement.offsetHeight + 'px' : 'No image',
            border: container.style.border || 'none',
        };
        imagesData.push(imageDetails);
    });

    const imageDetails = {
        images: imagesData,
        border: selectedBorder ? selectedBorder.style.borderColor : 'none',
        shape: selectedShape ? selectedShape.dataset.shape : 'default',
        size: selectedSize ? selectedSize.dataset.ratio : 'default',
        addedText: textElement ? textElement.innerText : [],
    };

    return imageDetails;
}


document.getElementById('acol-shareBtn').addEventListener('click', () => {
    shareBtn.disabled = true;
    shareBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    document.querySelectorAll('.acol-resize-handle, .acol-rotate-handle').forEach(handle => {
        handle.style.display = 'none';
    });

    html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
        canvas.toBlob((blob) => {
            const formData = new FormData();
            const now = new Date();
            const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-MM-SS
            const fileName = `customized-image-${formattedDate}.png`;

            const imageData = getImageDetails();
            formData.append('image', blob, fileName);
            formData.append('details', JSON.stringify(imageData));
            const subject = `Collage Acrylic Photo Order - ${formattedDate}`;
            formData.append('subject', JSON.stringify(subject));

            fetch('http://192.168.1.7:3000/send-email', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                })
                .finally(() => {
                    shareBtn.disabled = false;
                    shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
                });
        });
    });
});

window.updatePreview = updatePreview;
window.changeFontFamily = changeFontFamily;
