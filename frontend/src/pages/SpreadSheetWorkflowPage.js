import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import api from '../api';
import { useDropzone } from 'react-dropzone';

const SpreadSheetWorkflowPage = () => {
    // Dropzone functionality
    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]); // Append the first file

        try {
            const response = await api.post('/workflow/import/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <Navbar/>
            <div className="d-flex" style={{ minHeight: '80vh', justifyContent: 'center', alignItems: 'center' }}>
                <VerticalNavbar/>
                {/* Dropzone */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <div {...getRootProps()} className="dropzone-section" style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                                <input {...getInputProps()} />
                                <p>Drag and drop your excel file here, or click to select file</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default SpreadSheetWorkflowPage;