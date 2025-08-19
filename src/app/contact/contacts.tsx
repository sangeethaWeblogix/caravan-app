"use client";

import React, { useState } from "react";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    "your-name": "",

    "your-email": "",

    "your-phone": "",

    "you-postcode": "",

    "your-message": "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const form = new FormData();

      form.append("_wpcf7", "3290");

      form.append("_wpcf7_version", "5.9.3");

      form.append("_wpcf7_locale", "en_US");

      form.append("_wpcf7_unit_tag", "wpcf7-f3290-p45-o1");

      form.append("_wpcf7_container_post", "45");

      // append actual form values

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const res = await fetch(
        "https://www.caravansforsale.com.au/wp-json/contact-form-7/v1/contact-forms/3290/feedback",
        {
          method: "POST",

          body: form,
        }
      );

      const data = await res.json();

      if (data.status === "mail_sent") {
        setMessage("✅ Message sent successfully!");

        setFormData({
          "your-name": "",

          "your-email": "",

          "your-phone": "",

          "you-postcode": "",

          "your-message": "",
        });
      } else {
        setMessage("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);

      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
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
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 max-w-md mx-auto p-4 border rounded-lg shadow"
                >
                  <p className="text-center text-danger fs-12px mb-30">
                    The field is required mark as *
                  </p>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="your-name"
                          className="form-control"
                          placeholder="Name*"
                          value={formData["your-name"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="your-email"
                          className="form-control"
                          placeholder="Email*"
                          value={formData["your-email"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="your-phone"
                          className="form-control"
                          placeholder="Phone*"
                          value={formData["your-phone"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          name="you-postcode"
                          className="form-control"
                          placeholder="Postcode*"
                          value={formData["you-postcode"]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <textarea
                          className="form-control"
                          name="your-message"
                          value={formData["your-message"]}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-lg-12 text-center">
                      <input
                        type="submit"
                        value="SUBMIT"
                        disabled={loading}
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
