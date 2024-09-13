"use client";
import { useState } from "react";
import { CSSProperties } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { db, storage } from './firebase'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { Icons } from "next/dist/lib/metadata/types/metadata-types";

export default function FarmerPortal() {
  const [produceName, setProduceName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      //image upload 
      const storageRef = ref(storage, `images/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setPreview(downloadURL);
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image of your produce.");
      return;
    }

    try {
      await addDoc(collection(db, 'produce'), {
        produceName,
        quantity,
        price,
        location,
        image: preview, 
        timestamp: serverTimestamp(),
      });

      alert("Produce data saved successfully!");

      // form
      setProduceName("");
      setQuantity("");
      setPrice("");
      setLocation("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving data. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.navbar}>
          <div style={styles.logo}>Agro-Chain</div>
          <FaUserCircle style={styles.userIcon} />
        </nav>
        <h1>Farmer's Produce Portal</h1>
      </header>

      <section style={styles.uploadSection}>
        <h2 style={styles.sectionTitle}>Upload Your Produce</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Produce Name</label>
            <input
              type="text"
              value={produceName}
              onChange={(e) => setProduceName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Price (per kg)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Image Upload */}
          <div style={styles.formGroup}>
            <label>Upload Produce Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.fileInput}
              required
            />
          </div>

          {/* Preview */}
          {preview && (
            <div style={styles.imagePreviewContainer}>
              <img src={preview} alt="Produce Preview" style={styles.imagePreview} />
            </div>
          )}

          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </section>

      <section style={styles.featuredSection}>
        <h2 style={styles.sectionTitle}>Your Uploaded Produce</h2>
        
        {/*items displayed using cards */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <img src="/produce.png" alt="Produce" style={styles.image} />
            <h3>Organic Tomatoes</h3>
            <p>Quantity: 100 kg</p>
            <p>Location: Bangalore</p>
          </div>
          <div style={styles.card}>
            <img src="/produce.png" alt="Produce" style={styles.image} />
            <h3>Fresh Potatoes</h3>
            <p>Quantity: 50 kg</p>
            <p>Location: Chennai</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    color: "#000",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "black",
    borderBottom: "1px solid #ddd",
    marginBottom: "20px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  },
  userIcon: {
    fontSize: "24px",
    color: "#fff",
  },
  uploadSection: {
    backgroundColor: "#f8f8f8",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "40px",
  },
  sectionTitle: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
  },
  fileInput: {
    padding: "5px",
    fontSize: "16px",
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  imagePreviewContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  imagePreview: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "10px",
  },
  featuredSection: {
    marginTop: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },}
