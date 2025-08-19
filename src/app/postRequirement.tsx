import React from "react";

const postRequirement = () => {
  return (
    <div>
      <section className="post-requirements product-details section-padding">
        <div className="container">
          <div className="post_bgs">
            <div className="home-post_head">
              <h2>
                <span>Find Your Ideal Caravan</span> – Post Your Requirements
              </h2>
              <p>
                Tell us what you&apos;re looking for and we&apos;ll match you
                with the right caravan for sale, from trusted dealers at a fair
                price. Make sure your budget and expectations are realistic to
                help us deliver the best possible outcome. See some examples of
                what other caravan buyers are looking for.
              </p>
            </div>

            {/* Example Post Requirement */}
            <div className="home-post__items info top_cta_container">
              <div className="top_cta bg-white">
                <div className="home_post_middle hidden-xs">
                  <div className="type">Type</div>
                  <div className="condition">Condition</div>
                  <div className="requirements">Requirements</div>
                  <div className="status">Status</div>
                  <div className="location">Location</div>
                  <div className="budget">Budget</div>
                </div>

                <div className="post_flip">
                  <a href="#" className="home-post__item d-flex">
                    <div className="type">Off Road</div>
                    <div className="condition">New</div>
                    <div className="requirements">
                      We are looking for a high-quality off-road caravan with
                      full off-grid capability, suitable for long-distance
                      travel across rugged Australian terrains. Must have a
                      queen bed, separate shower and toilet, lithium battery
                      setup, solar panels, and a robust independent suspension.
                    </div>
                    <div className="status">
                      <i className="fa fa-check" /> Active
                    </div>
                    <div className="location">3061</div>
                    <div className="budget">$30,000</div>
                  </a>
                </div>
                <div className="post_flip">
                  <a href="#" className="home-post__item d-flex">
                    <div className="type">Off Road</div>
                    <div className="condition">New</div>
                    <div className="requirements">
                      We are looking for a high-quality off-road caravan with
                      full off-grid capability, suitable for long-distance
                      travel across rugged Australian terrains. Must have a
                      queen bed, separate shower and toilet, lithium battery
                      setup, solar panels, and a robust independent suspension.
                    </div>
                    <div className="status">
                      <i className="fa fa-check" /> Active
                    </div>
                    <div className="location">3061</div>
                    <div className="budget">$30,000</div>
                  </a>
                </div>
              </div>
            </div>

            <div className="final_post_btn">
              <a href="/caravan-enquiry-form/" className="btn">
                Post Your Requirements
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default postRequirement;
