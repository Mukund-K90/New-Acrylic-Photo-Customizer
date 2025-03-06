async function removeBg(imageBlob, backgroundUrl) {
    const formData = new URLSearchParams();
    formData.append("size", "auto");
    formData.append("image_file_b64", imageBlob);
    backgroundUrl ? formData.append("bg_image_url", backgroundUrl) : null;

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": key },
        body: formData,
    });

    if (response.ok) {
        return await response.arrayBuffer();
    } else {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${response.statusText} - ${errorText}`);
    }
}

module.exports={
    removeBg
}