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
    const [distance, setDistance] = useState<number | null>(null);


    useEffect(() => {
        axios.get<Product[]>("http://localhost:9999/products-api/products") // Replace with your actual API endpoint
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
                `http://localhost:9999/locations-api/locations/${sourcePostcode}`
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
                `http://localhost:9999/locations-api/locations/${destinationPostcode}`
            )
            .then((response) => {
                const data = response.data.result;
                const addressText = `${data?.lsoa}, ${data?.postcode}` || "Not found";
                setDestinationAddress(addressText);
                setDestinationCoords({ lat: data.latitude, lon: data.longitude });

                // Trigger distance calculation here
                if (sourceCoords.lat && sourceCoords.lon && data.latitude && data.longitude) {
                    axios.get<number>('http://localhost:9999/locations-api/locations/distance', {
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

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Left Panel: Postcode & Address Info */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Source Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={sourcePostcode} onChange={(e) => setSourcePostcode(e.target.value)}/>
                            <button className="btn btn-outline-primary" onClick={handleFindSourceAddress}>Find</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly value={sourceAddress} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Destination Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" value={destinationPostcode} onChange={(e) => setDestinationPostcode(e.target.value)}/>
                            <button className="btn btn-outline-primary" onClick={handleFindDestinationAddress}>Find</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly value={destinationAddress} />
                    </div>
                </div>

                {/* Right Panel: Item Details */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Item Combo</label>
                        <select className="form-select">
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
                        <input type="text" className="form-control" />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Height (cm)</label>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Width (cm)</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Distance, Price, and Order */}
            <div className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Distance (km)</label>
                        <input type="text" className="form-control" readOnly value={distance !== null ? distance + ' km' : ''}/>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Total Price</label>
                        <input type="text" className="form-control" readOnly />
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn btn-success btn-lg w-50">Place Order</button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
