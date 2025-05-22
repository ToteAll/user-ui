import React, {useEffect, useState} from "react";
import {PostcodeResult, Product} from "./model";
import axios from "axios";

const OrderForm = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [sourcePostcode, setSourcePostcode] = useState("");
    const [sourceAddress, setSourceAddress] = useState("");
    const [destinationPostcode, setDestinationPostcode] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [sourceCoords, setSourceCoords] = useState({ lat: 0, lon: 0 });
    const [destinationCoords, setDestinationCoords] = useState({ lat: 0, lon: 0 });
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [width, setWidth] = useState("");
    const [distance, setDistance] = useState<number | null>(null);
    const [price, setPrice] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverContact, setReceiverContact] = useState("");


    useEffect(() => {
        axios.get<Product[]>("/products-api/products") // Replace with your actual API endpoint
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const handleFindSourceAddress = () => {
        if (!sourcePostcode.trim()) return;

        axios
            .get<PostcodeResult>(
                `/locations-api/locations/${sourcePostcode}`
            )
            .then((response) => {
                const data = response.data.result;
                const addressText = `${data?.lsoa}, ${data?.postcode}` || "Not found";
                setSourceAddress(addressText);
                setSourceCoords({ lat: data.latitude, lon: data.longitude });
            })
            .catch((error) => {
                console.error("Error fetching address:", error);
                setSourceAddress("Error fetching address");
            });
    };

    const handleFindDestinationAddress = () => {
        if (!destinationPostcode.trim()) return;

        axios
            .get<PostcodeResult>(
                `/locations-api/locations/${destinationPostcode}`
            )
            .then((response) => {
                const data = response.data.result;
                const addressText = `${data?.lsoa}, ${data?.postcode}` || "Not found";
                setDestinationAddress(addressText);
                setDestinationCoords({ lat: data.latitude, lon: data.longitude });

                // Trigger distance calculation here
                if (sourceCoords.lat && sourceCoords.lon && data.latitude && data.longitude) {
                    axios.get<number>('/locations-api/locations/distance', {
                        params: {
                            sourceLat: sourceCoords.lat,
                            sourceLon: sourceCoords.lon,
                            destinationLat: data.latitude,
                            destinationLon: data.longitude
                        }
                    })
                        .then(res => setDistance(res.data))
                        .catch(() => setDistance(null));
                }
            })
            .catch((error) => {
                console.error("Error fetching address:", error);
                setDestinationAddress("Error fetching address");
            });
    };

    const handleEstimatePrice = (newWidth: string) => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct || !distance || !weight || !height || !newWidth) return;

        const order = {
            basePrice: selectedProduct.deliveryCharge,
            km: distance,
            weight: parseFloat(weight),
            height: parseFloat(height),
            width: parseFloat(newWidth)
        };

        axios.post("/orders-api/estimate", order)
            .then(res => setPrice(res.data))
            .catch(err => {
                console.error("Price estimation error:", err);
                setPrice("Error");
            });
    };

    const handlePlaceOrder = () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct || !distance || !price) {
            alert("Please fill all required fields before placing the order.");
            return;
        }

        const orderData = {
            receiverName,
            receiverContact,
            senderName: "John Smith",           // You can add sender input fields or fetch from session
            senderContact: "1234567890",        // You can add sender input fields or fetch from session
            senderEmail: "john@example.com",    // You can add sender input fields or fetch from session
            distance,
            price: parseFloat(price),
            itemCode: selectedProduct.id || selectedProduct.name, // adjust as per your model
            height: parseFloat(height),
            weight: parseFloat(weight),
            sourcePostcode,
            destinationPostcode
        };

        axios.post("/orders-api/place-order", orderData)
            .then(() => {
                alert("Order placed successfully!");
                // Optionally clear form here
            })
            .catch((err) => {
                console.error("Order creation error:", err);
                alert("Failed to place order.");
            });
    };


    return (
        <div className="container mt-4">
            <div className="row">
                {/* Left Panel: Postcode & Address Info */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Source Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={sourcePostcode}
                                   onChange={(e) => setSourcePostcode(e.target.value)}/>
                            <button className="btn btn-outline-primary" onClick={handleFindSourceAddress}>Find</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly value={sourceAddress}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Destination Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={destinationPostcode}
                                   onChange={(e) => setDestinationPostcode(e.target.value)}/>
                            <button className="btn btn-outline-primary" onClick={handleFindDestinationAddress}>Find
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly value={destinationAddress}/>
                    </div>
                </div>

                {/* Right Panel: Item Details */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Item Combo</label>
                        <select className="form-select"
                                onChange={(e) => setSelectedProductId(parseInt(e.target.value))}>
                            <option value="">Select item</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input type="text" className="form-control" value={weight}
                               onChange={(e) => setWeight(e.target.value)}/>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Height (cm)</label>
                            <input type="text" className="form-control" value={height}
                                   onChange={(e) => setHeight(e.target.value)}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Width (cm)</label>
                            <input type="text" className="form-control" value={width} onChange={(e) => {
                                const newWidth = e.target.value;
                                setWidth(newWidth);
                                handleEstimatePrice(newWidth);
                            }}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Distance, Price, and Order */}
            <div className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Distance (km)</label>
                        <input type="text" className="form-control" readOnly
                               value={distance !== null ? distance + ' km' : ''}/>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Total Price</label>
                        <input type="text" className="form-control" readOnly value={price}/>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Receiver Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Receiver Contact</label>
                        <input
                            type="text"
                            className="form-control"
                            value={receiverContact}
                            onChange={(e) => setReceiverContact(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn btn-success btn-lg w-50" onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div>

        </div>
    );
};

export default OrderForm;
