// import Image from "next/image";

// export default function OffRoadCaravans2025() {
//   return (
//     <div className="blog-page style-5 color-4">
//       <section className="all-news section-padding pt-50 blog bg-transparent single_blog style-3">
//         <div className="container">
//           <div className="blog-details-slider mb-30">
//             <div className="content-card">
//               <div className="img">
//                 <div className="desktop_image hidden-xs">
//                   <Image
//                     src="https://www.caravansforsale.com.au/wp-content/uploads/2025/06/1.jpg"
//                     alt="Desktop Banner"
//                     width={1200}
//                     height={700}
//                     className="w-full h-auto"
//                   />
//                 </div>
//                 <div className="mobile_image hidden-lg hidden-md hidden-sm">
//                   <Image
//                     src="https://www.caravansforsale.com.au/wp-content/uploads/2025/06/2.jpg"
//                     alt="Mobile Banner"
//                     width={1024}
//                     height={683}
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-lg-9">
//               <div className="d-flex small align-items-center justify-content-between mt-10">
//                 <div className="l_side d-flex align-items-center">
//                   <i className="bi bi-clock me-1"></i>
//                   <span>June 17, 2025</span>
//                 </div>
//               </div>

//               <h1 className="mb-20 mt-10 color-000">
//                 Best Off Road Caravans 2025: What’s New, Tough, and Worth Your
//                 Money
//               </h1>

//               <div className="blog-content-info">
//                 {/* Content goes here: Use dangerouslySetInnerHTML if content is static and trusted */}
//                 {/* Or convert entire content into JSX/MDX if editable */}
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: `<p>The demand for find the best off-road caravan is soaring...</p>
//                     <a class='banner_ad_now' href='https://www.caravansforsale.com.au/' style='border: 1px solid #d3d3d3;box-shadow: 0px 0px 10px rgb(0 0 0 / 8%);margin-bottom: 15px;margin-top: 10px;'>
//                       <Image decoding='async' class='hidden-xs' src='https://www.caravansforsale.com.au/images/index_link_dk.jpg' />
//                       <Image decoding='async' class='hidden-lg hidden-md hidden-sm' src='https://www.caravansforsale.com.au/images/index_link_m.jpg' />
//                     </a>`,
//                   }}
//                 />
//                 {/* You may optionally break down each caravan section into its own React component */}
//               </div>
//             </div>

//             <div className="col-lg-3 rightbar-stick">
//               <div className="theiaStickySidebar">
//                 <p>side bar</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogDetail } from "../../../api/blog-list/api";
import { formatPostDate } from "@/utils/date";
import { notFound } from "next/navigation";

type BlogDetail = {
  id: number;
  slug: string;
  title: string;
  date?: string;
  banner_image?: string;
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
  console.log("dataaa", data);
  console.log("dataaapost", post);

  return (
    <div className="blog-page style-5 color-4">
      <section className="all-news section-padding pt-50 blog bg-transparent single_blog style-3">
        <div className="container">
          <div className="blog-details-slider mb-30">
            <h1>{post.title}</h1>
          </div>
        </div>
      </section>
    </div>
  );
}
