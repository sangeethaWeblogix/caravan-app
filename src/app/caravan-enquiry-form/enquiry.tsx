"use client";

import React from "react";

export default function ContactSection() {
  return (
    <>
      <section className="community contact_top section-padding style-5">
        <div className="container">
          <div className="section-head text-center style-4">
            <h2 className="text-center mb-20">
              Exclusive Offers From Select<br></br>Quality Caravan Manufacturers
            </h2>
          </div>
        </div>
      </section>

      <section className="contact section-padding pt-0 style-6">
        <div className="container">
          <div className="content">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <form action="" className="form" method="post">
                  <p className="text-center text-danger fs-12px mb-30">
                    Fill out the form below, and we&apos;ll send you exclusive
                    deals for the best caravans in the market.
                  </p>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          placeholder="Email Address*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Phone Number*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="postcode"
                          className="form-control"
                          placeholder="Postcode*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <select className="form-control">
                          <option value="">
                            What type of caravan are you looking for ?
                          </option>
                          <option value="Off Road">Off Road</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Pop Top">Pop Top</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Family">Family</option>
                          <option value="Touring">Touring</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <select className="form-control">
                          <option value="">Select Condition</option>
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                          <option value="Near New">Near New</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="budget"
                          className="form-control"
                          placeholder="What is your budget?*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <textarea
                          className="form-control"
                          placeholder="Requirements (Description)*"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-lg-12 text-center">
                      <input
                        type="submit"
                        value="SUBMIT"
                        className="btn bg-blue4 fw-bold text-white text-light fs-12px"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
