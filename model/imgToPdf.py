import sys
import ast
import cv2
from fpdf import FPDF

def create_pdf(image_paths):
    output_path = "C:/Users/Panna/Desktop/CavernousHoaxScanner/images/datahouse/temp.pdf"
    pdf = FPDF()
    for image_path in image_paths:
        img = cv2.imread(image_path)
        height , width = img.shape[:2]
        width_mm = width*25.4/96
        heigth_mm = height*25.4/96
        pdf.add_page(orientation= 'P' if  width <= height else 'L')
        #format=(width_mm,heigth_mm)
        pdf.image(image_path,0,0,width_mm,heigth_mm)
    pdf.output(output_path)
    
def is_image(image_path):
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif','.webp','.svg','.jpe','.jfif']
    if not any(image_path.endswith(ext) for ext in valid_extensions):
        return False

    # Try to read the image using OpenCV
    try:
        img = cv2.imread(image_path)
        # If the image is read successfully, check if it's not empty
        if img is not None:
            return True
    except Exception as e:
        print(f"Error reading image: {e}")

    return False

def convert_pdf(input_list):
    if './model/main.py' in sys.argv[0]:
        input_list = [str(X) for X in input_list[0].split(',')]

    for i in range (0, len(input_list)):
        if is_image(input_list[i]) == False:
            return 4
    create_pdf(input_list)

def main():
    if len(sys.argv) != 2:
        print("Usage: imgToPdf.py <list-value>")
        return
    
    input_list = ast.literal_eval(sys.argv[1])
    image_paths = ['C:/Users/Panna/Desktop/CA1/SOFT COMP/ADV.png','C:/Users/Panna/Desktop/CA1/SOFT COMP/N 1.png']
    convert_pdf(image_paths)

if __name__ == "__main__":
    main()