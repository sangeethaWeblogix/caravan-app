// src/app/components/ContactSection.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// 👇 make sure this path matches the API file you created
import {
  createRequirementCF7,
  type RequirementPayload,
} from "@/api/postRequirementEnquiry/api";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  type: string;
  condition: string;
  budget: string;
  requirements: string;
};

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      postcode: "",
      type: "",
      condition: "",
      budget: "",
      requirements: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: RequirementPayload = {
      // contact
      name: values.name,
      email: values.email,
      phone: values.phone,

      // requirement
      type: values.type, // CF7 helper will slugify
      condition: values.condition, // CF7 helper will slugify
      location: values.postcode,
      requirements: values.requirements,
      budget: values.budget,

      // optional flags (only if your CF7 has hidden inputs with these names)
      featured: "0",
      active: "1",
    };

    await toast.promise(
      (async () => {
        const resp = await createRequirementCF7(payload);

        if (resp.status === "mail_sent") {
          reset();
          return "OK";
        }

        if (resp.status === "validation_failed") {
          // You can surface resp.invalid_fields to the UI if desired
          console.warn("CF7 invalid fields:", resp.invalid_fields);
          throw new Error(resp.message || "Validation failed");
        }

        // mail_failed
        throw new Error(resp.message || "Mail failed");
      })(),
      {
        loading: "Submitting…",
        success: "Thanks! Your request has been submitted.",
        error: (e) =>
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
      }
    );
  };

  return (
    <>
      <section className="community contact_top section-padding style-5">
        <div className="container">
          <div className="section-head text-center style-4">
            <h2 className="text-center mb-20">
              Exclusive Offers From Select
              <br />
              Quality Caravan Manufacturers
            </h2>
          </div>
        </div>
      </section>

      <section className="contact section-padding pt-0 style-6">
        <div className="container">
          <div className="content">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <form
                  className="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <p className="text-center text-danger fs-12px mb-30">
                    Fill out the form below, and we&apos;ll send you exclusive
                    deals for the best caravans in the market.
                  </p>

                  <div className="row">
                    {/* Name */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          placeholder="Name*"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          {...register("name", {
                            required: "Name is required",
                          })}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="email"
                          placeholder="Email Address*"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email",
                            },
                          })}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          placeholder="Phone Number*"
                          className={`form-control ${
                            errors.phone ? "is-invalid" : ""
                          }`}
                          {...register("phone", {
                            required: "Phone is required",
                            pattern: {
                              value: /^[0-9+\s()-]{6,20}$/,
                              message: "Enter a valid phone number",
                            },
                          })}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Postcode */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          placeholder="Postcode*"
                          className={`form-control ${
                            errors.postcode ? "is-invalid" : ""
                          }`}
                          {...register("postcode", {
                            required: "Postcode is required",
                            pattern: {
                              value: /^\d{4}$/,
                              message: "Postcode must be 4 digits",
                            },
                          })}
                        />
                        {errors.postcode && (
                          <div className="invalid-feedback">
                            {errors.postcode.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <select
                          className={`form-control ${
                            errors.type ? "is-invalid" : ""
                          }`}
                          {...register("type", {
                            required: "Please select a caravan type",
                          })}
                        >
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
                        {errors.type && (
                          <div className="invalid-feedback">
                            {errors.type.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <select
                          className={`form-control ${
                            errors.condition ? "is-invalid" : ""
                          }`}
                          {...register("condition", {
                            required: "Please select condition",
                          })}
                        >
                          <option value="">Select Condition</option>
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                          <option value="Near New">Near New</option>
                        </select>
                        {errors.condition && (
                          <div className="invalid-feedback">
                            {errors.condition.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <input
                          type="text"
                          placeholder="What is your budget?*"
                          className={`form-control ${
                            errors.budget ? "is-invalid" : ""
                          }`}
                          {...register("budget", {
                            required: "Budget is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message: "Enter a valid amount",
                            },
                          })}
                        />
                        {errors.budget && (
                          <div className="invalid-feedback">
                            {errors.budget.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <textarea
                          rows={4}
                          placeholder="Requirements (Description)*"
                          className={`form-control ${
                            errors.requirements ? "is-invalid" : ""
                          }`}
                          {...register("requirements", {
                            required: "Please describe your requirement",
                          })}
                        />
                        {errors.requirements && (
                          <div className="invalid-feedback">
                            {errors.requirements.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-lg-12 text-center">
                      <button
                        type="submit"
                        className="btn bg-blue4 fw-bold text-white text-light fs-12px"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "SUBMITTING…" : "SUBMIT"}
                      </button>
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
