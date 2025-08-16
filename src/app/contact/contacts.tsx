"use client";

import React from "react";

export default function ContactSection() {
  return (
    <>
      <section className="community contact_top section-padding style-5">
        <div className="container">
          <div className="section-head text-center style-4">
            <h2 className="text-center mb-20">Get in Touch</h2>
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
                    The field is required mark as *
                  </p>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          placeholder="Email*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Phone*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="postcode"
                          className="form-control"
                          placeholder="Postcode*"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <textarea
                          className="form-control"
                          placeholder="How can we help you?"
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
