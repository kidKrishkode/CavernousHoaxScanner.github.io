import sys
import ast
import cv2
from fpdf import FPDF
import Preprocessor

def collage_pdf(image_paths):
    output_path = "./assets/pdfhouse/temp.pdf"
    pdf = FPDF()
    for image_path in image_paths:
        page_width, page_height = 210, 297
        new_width = (page_width / 2 ) - 6
        new_height = (len(image_paths) / 2) - 4
        pdf.add_page(orientation= 'P' if  new_width <= new_height else 'L')
        x_offset = (page_width - new_width) / 2 if new_width < page_width else 0
        y_offset = (page_height - new_height) / 2 if new_height < page_height else 0
        pdf.image(image_path, x_offset, y_offset, new_width, new_height)
    pdf.output(output_path)
    return output_path

def create_pdf(image_paths):
    output_path = "./assets/pdfhouse/temp.pdf"
    pdf = FPDF()
    for image_path in image_paths:
        img = cv2.imread(image_path)
        img_height, img_width = img.shape[:2]
        # A4 page dimensions in mm
        page_width, page_height = 210, 297
        img_aspect = img_width / img_height
        page_aspect = page_width / page_height
        if img_aspect > page_aspect:
            new_width = page_width
            new_height = page_width / img_aspect
        else:
            new_height = page_height
            new_width = page_height * img_aspect
        pdf.add_page(orientation= 'P' if  new_width <= new_height else 'L')
        x_offset = (page_width - new_width) / 2 if new_width < page_width else 0
        y_offset = (page_height - new_height) / 2 if new_height < page_height else 0
        pdf.image(image_path, x_offset, y_offset, new_width, new_height)
    pdf.output(output_path)
    return output_path


def convert_pdf(input_list):
    if './model/main.py' in sys.argv[0]:
        input_list = [str(X) for X in input_list[0].split(',')]

    for i in range (0, len(input_list)):
        if Preprocessor.is_image(input_list[i]) == False:
            return 4
    output_path = create_pdf(input_list)
    return output_path

def main():
    if len(sys.argv) != 2:
        print("Usage: imgToPdf.py <list-value>")
        return
    
    input_list = ast.literal_eval(sys.argv[1])
    output_path = convert_pdf(input_list)
    print(output_path)

if __name__ == "__main__":
    main()