import sys

def extract_docx(file_path):
    try:
        import docx
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    except ImportError:
        return "python-docx not installed"
    except Exception as e:
        return str(e)

def extract_pdf(file_path):
    try:
        import PyPDF2
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    except ImportError:
        try:
            import fitz
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except ImportError:
            return "PyPDF2 or PyMuPDF not installed"
        except Exception as e:
            return str(e)
    except Exception as e:
        return str(e)

with open(r"c:\Users\Mike\Desktop\Unischool\docs\extracted_docs.txt", "w", encoding="utf-8") as f:
    f.write("--- Prompt University School.docx ---\n")
    f.write(extract_docx(r"c:\Users\Mike\Desktop\Unischool\inspiration\Prompt University School.docx"))
    f.write("\n\n--- PRD UNIVERSITY SCHOOL.pdf ---\n")
    f.write(extract_pdf(r"c:\Users\Mike\Desktop\Unischool\inspiration\PRD UNIVERSITY SCHOOL.pdf"))
    f.write("\n\n--- University School One Page.pdf ---\n")
    f.write(extract_pdf(r"c:\Users\Mike\Desktop\Unischool\inspiration\University School One Page.pdf"))

