import React from "react";

const OrderForm = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                {/* Left Panel: Postcode & Address Info */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Source Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" />
                            <button className="btn btn-outline-primary">Find</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Destination Postcode</label>
                        <div className="input-group">
                            <input type="text" className="form-control" />
                            <button className="btn btn-outline-primary">Find</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address Full</label>
                        <input type="text" className="form-control" readOnly />
                    </div>
                </div>

                {/* Right Panel: Item Details */}
                <div className="col-md-6 border p-3">
                    <div className="mb-3">
                        <label className="form-label">Item Combo</label>
                        <select className="form-select">
                            <option>Select item</option>
                            <option>Box</option>
                            <option>Envelope</option>
                            <option>Crate</option>
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
                        <input type="text" className="form-control" readOnly />
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
