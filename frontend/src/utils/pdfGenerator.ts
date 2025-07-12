import jsPDF from 'jspdf';
import { ImageState } from '../types';
import { luckeybonesFontBase64 } from './fonts/luckeybonesFontBase64';

export const downloadStoryAsPDF = async (
  title: string,
  storyPages: string[][],
  imageStates: ImageState[]
) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [3, 4],
  });

  const pageWidth = 3;
  const pageHeight = 4;
  const gradientSteps = 20;
  const stepHeight = pageHeight / gradientSteps;

  // 👉 Embed Luckeybones font
  pdf.addFileToVFS("Luckeybones-Regular.ttf", luckeybonesFontBase64.trim());
  pdf.addFont("Luckeybones-Regular.ttf", "Luckeybones", "normal");

  const storyCards: string[] = [];
  storyPages.forEach(page => page.forEach(paragraph => storyCards.push(paragraph)));

  const gradientBackgrounds = [
    ['#FFDEE9', '#B5FFFC'],
    ['#C9FFBF', '#FFAFBD'],
    ['#FDCB82', '#A1C4FD'],
    ['#FF9A9E', '#FECFEF'],
    ['#D4FC79', '#96E6A1'],
    ['#84FAB0', '#8FD3F4']
  ];

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ];
  };

  const blendColors = (start: number[], end: number[], ratio: number) => {
    return start.map((s, i) => Math.round(s + (end[i] - s) * ratio)) as [number, number, number];
  };

  // 👉 Cover Page
  const [coverStartHex, coverEndHex] = gradientBackgrounds[0];
  const coverStartRGB = hexToRgb(coverStartHex);
  const coverEndRGB = hexToRgb(coverEndHex);

  for (let s = 0; s < gradientSteps; s++) {
    const ratio = s / (gradientSteps - 1);
    const [r, g, b] = blendColors(coverStartRGB, coverEndRGB, ratio);
    pdf.setFillColor(r, g, b);
    pdf.rect(0, s * stepHeight, pageWidth, stepHeight, 'F');
  }

  // Sparkles
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('✨', 0.2, 0.3);
  pdf.text('✨', pageWidth - 0.3, 0.3);
  pdf.text('✨', 0.2, pageHeight - 0.3);
  pdf.text('✨', pageWidth - 0.3, pageHeight - 0.3);

  // 👉 Use Luckeybones font for title
// Title with Luckeybones
pdf.setFont("Luckeybones", "normal");
pdf.setFontSize(26);
pdf.setTextColor(30, 30, 60);

// Split title into lines if too long
const titleLines = pdf.splitTextToSize(title, pageWidth - 0.4); // leave 0.2in margin each side
const lineHeight = 0.4; // adjust if needed

// Compute starting Y so the block is centered vertically
const totalHeight = titleLines.length * lineHeight;
let startY = (pageHeight - totalHeight) / 2 + 0.3; // +0.3 for slight visual balance

// Draw each line centered
titleLines.forEach(line => {
  pdf.text(line, pageWidth / 2, startY, { align: "center" });
  startY += lineHeight;
});


  // 👉 Story Pages
  for (let i = 0; i < storyCards.length; i++) {
    pdf.addPage();

    const imageState = imageStates[i];
    let paragraph = storyCards[i].trim().replace(/^["(]+|["(]+$/g, '');

    const [startHex, endHex] = gradientBackgrounds[(i + 1) % gradientBackgrounds.length];
    const startRGB = hexToRgb(startHex);
    const endRGB = hexToRgb(endHex);

    for (let s = 0; s < gradientSteps; s++) {
      const ratio = s / (gradientSteps - 1);
      const [r, g, b] = blendColors(startRGB, endRGB, ratio);
      pdf.setFillColor(r, g, b);
      pdf.rect(0, s * stepHeight, pageWidth, stepHeight, 'F');
    }

    // Image on top
    const imgW = 3;
    const imgH = 3;
    const imgX = 0;
    const imgY = 0;

    if (imageState?.imageUrl) {
      try {
        const img = await loadImage(imageState.imageUrl);
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(imgX - 0.05, imgY - 0.05, imgW + 0.1, imgH + 0.1, 0.1, 0.1, 'F');
        pdf.addImage(img, 'PNG', imgX, imgY, imgW, imgH);
      } catch (e) {
        console.error("Failed to load image:", e);
      }
    }

    // Paragraph area
    const paraY = imgH;
    const paraHeight = 1;
    pdf.setFillColor(...blendColors(startRGB, endRGB, 0.5));
    pdf.rect(0, paraY, pageWidth, paraHeight, 'F');

    // 👉 Use Luckeybones font for paragraph
    pdf.setFont("Luckeybones", "normal"); // 🟢 Paragraph text
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 80);
    const lines = pdf.splitTextToSize(paragraph, pageWidth - 0.2);
    pdf.text(lines, 0.1, paraY + 0.15);
  }

  // 👉 End Page
  pdf.addPage();
  const [endR, endG, endB] = hexToRgb('#A1C4FD');
  pdf.setFillColor(endR, endG, endB);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // 👉 Use Luckeybones font for ending
  pdf.setFont("Luckeybones", "normal"); // 🟢 The End text
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text('🌈 The End 🌈', pageWidth / 2, pageHeight / 2, { align: 'center' });

  pdf.setFontSize(8);
  // pdf.text('', pageWidth / 2, pageHeight - 0.4, { align: 'center' });
  // pdf.text('', pageWidth / 2, pageHeight - 0.2, { align: 'center' });

  const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${sanitizedTitle}_storybook.pdf`);
};

// Image loader
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};
