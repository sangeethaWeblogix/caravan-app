import Image from "next/image";
import { notFound } from "next/navigation";

type BlogDetail = {
  id: number;
  slug: string;
  title: string;
  date?: string;
  banner_image?: string;
  image?: string;
  content?: string; // HTML
};
type BlogDetailResponse = {
  data?: { blog_detail?: BlogDetail };
  messages?: { faq?: string; related_blogs?: string };
  seo?: { metatitle?: string; metadescription?: string; index?: string };
};
export default function blogDetailsPage({
  data,
}: {
  data: BlogDetailResponse;
}) {
  const post = data?.data?.blog_detail;
  // console.log("dataaa", data);
  // console.log("dataaapost", post);
  if (!post) {
    notFound();
  }
  return (
    <div className="blog-page style-5 color-4">
      <section className="all-news section-padding pt-50 blog bg-transparent single_blog style-3">
            <div className="container">
              <div className="blog-details-slider mb-30">
                <div className="content-card">
                  <div className="img">
                    <div className="desktop_image hidden-xs">
                      <Image
                        src={post.banner_image || ""}
                        alt="Desktop Banner"
                        width={0}
                        height={0}
                        className="w-full h-auto"
                        unoptimized
                      />
                    </div>
                    <div className="mobile_image hidden-lg hidden-md hidden-sm">
                      <Image
                        src={post.image || ""}
                        width={1024}
                        height={683}
                        alt="Mobile Banner"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-9">
                  <div className="d-flex small align-items-center justify-content-between mt-10">
                    <div className="l_side d-flex align-items-center">
                      <i className="bi bi-clock me-1"></i>
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <h1 className="mb-20 mt-10 color-000">{post.title}</h1>

                  <div className="blog-content-info">
                    {/* Content goes here: Use dangerouslySetInnerHTML if content is static and trusted */}
                    {/* Or convert entire content into JSX/MDX if editable */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.content || "<p>No content available</p>",
                      }}
                    />
                    {/* You may optionally break down each caravan section into its own React component */}
                  </div>
                </div>

                <div className="col-lg-3 rightbar-stick">
                  <div className="theiaStickySidebar">
                    <p>side bar</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}
