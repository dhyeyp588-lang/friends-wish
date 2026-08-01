const text="Thank you for being my best friend. Happy Friendship Day! 💙";
let i=0;
function type(){if(i<text.length){msg.textContent+=text[i++];setTimeout(type,45);}}
type();

const images=[
"pic/WhatsApp Image 2026-08-01 at 8.56.40 PM (1).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.40 PM.jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (1).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (2).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (3).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (4).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (5).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (6).jpeg",
"pic/WhatsApp Image 2026-08-01 at 8.56.41 PM.jpeg",
"pic/IMG_1356.JPG",
"pic/20250217_122403.jpg",
"pic/IMG_3593.JPG",
"pic/IMG_3596.JPG"
];
let idx=0;
function nextImg(){idx=(idx+1)%images.length;slide.src=images[idx];}
setInterval(nextImg,2500);
