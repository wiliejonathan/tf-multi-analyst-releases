// Render at 2x internally, deliver exact 1080x1440 sRGB PNG for upload.
(() => {
  function create(width=1080,height=1440){const canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=height*2;const c=canvas.getContext('2d',{alpha:false,colorSpace:'srgb'});c.scale(2,2);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';return {canvas,c};}
  async function finish(source){
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
    const c=canvas.getContext('2d',{alpha:false,colorSpace:'srgb'});c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(source,0,0,1080,1440);
    // Small bounded luminance-only edge boost; never sharpen smooth gradients.
    const image=c.getImageData(0,0,1080,1440),pixels=image.data,original=new Uint8ClampedArray(pixels),w=1080;
    const luma=i=>.2126*original[i]+.7152*original[i+1]+.0722*original[i+2];
    for(let y=1;y<1439;y++)for(let x=1;x<1079;x++){
      const i=(y*w+x)*4,center=luma(i),detail=center-(luma(i-4)+luma(i+4)+luma(i-w*4)+luma(i+w*4))/4;
      const neighbors=[luma(i-4),luma(i+4),luma(i-w*4),luma(i+w*4)],range=Math.max(center,...neighbors)-Math.min(center,...neighbors);
      if(range<4){
        // Deterministic, zero-centered triangular luminance dither in smooth areas only.
        // It breaks 8-bit contour bands without changing geometry or softening text edges.
        let hash=(Math.imul(x+1,374761393)^Math.imul(y+1,668265263))>>>0;hash=Math.imul(hash^(hash>>>13),1274126177)>>>0;hash^=hash>>>16;
        const noise=(((hash&65535)/65535)+((hash>>>16)/65535)-1)*1.65;
        for(let k=0;k<3;k++)pixels[i+k]=original[i+k]+noise;
      }else if(Math.abs(detail)>=3){const boost=Math.max(-6,Math.min(6,detail*.2));for(let k=0;k<3;k++)pixels[i+k]=original[i+k]+boost;}
    }
    c.putImageData(image,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG gagal dibuat.');
    return {blob,preview:canvas.toDataURL('image/png')};
  }
  globalThis.ExportQuality={create,finish};
})();
