import {useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerticalNavbar from '../components/VerticalNavbar';
import api from '../api';
import { UserContext } from "../context/UserContext";
import { useDropzone } from 'react-dropzone';
import {useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";


const SpreadSheetWorkflowPage = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [spreadsheetURL, setspreadsheetURL] = useState("");

const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!spreadsheetURL) {
        alert("Please enter a valid Google Sheet ID.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file); // Only send the file in FormData
    formData.append("spreadsheet_url", spreadsheetURL);

    try {
        // Send spreadsheet_id as a query parameter
        await api.post(`/workflow/${id}/update-sheet`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        alert("File uploaded and Google Sheet updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Error updating Google Sheet. Please check your inputs and try again.");
    }
};

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: true,
    });

    return (
        <div>
            <Navbar />
            <div
                className="d-flex"
                style={{ minHeight: "80vh", justifyContent: "center", alignItems: "center" }}
            >
                <VerticalNavbar />
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            {/* Input Field for Google Sheet ID */}
                            <div className="mb-3">
                                <label htmlFor="googleSheetId" className="form-label">
                                    Google Sheet ID
                                </label>
                                <input
                                    type="text"
                                    id="googleSheetId"
                                    className="form-control"
                                    value={spreadsheetURL}
                                    onChange={(e) => setspreadsheetURL(e.target.value)}
                                    placeholder="Enter Google Sheet ID"
                                />
                            </div>

                            {/* Dropzone Section */}
                            <div
                                {...getRootProps()}
                                className="dropzone-section"
                                style={{
                                    border: "2px dashed #cccccc",
                                    padding: "20px",
                                    textAlign: "center",
                                }}
                            >
                                <input {...getInputProps()} />
                                <p>Drag and drop your Excel file here, or click to select a file</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SpreadSheetWorkflowPage;