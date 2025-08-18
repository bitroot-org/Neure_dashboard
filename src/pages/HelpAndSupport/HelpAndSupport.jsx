import React, { useState, useEffect } from "react";
import { Collapse, Card, Button, Space } from "antd";
import FeedbackModal from "../../components/FeedBackModal";
import CustomHeader from "../../components/CustomHeader";
import { getQna } from "../../services/api";

const FAQShimmer = () => (
  <>
    <div
      className="my-5 h-20 w-[70%] rounded bg-[length:200%_100%] animate-shimmer"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #2D2F39 0%, #363845 50%, #2D2F39 100%)",
      }}
    />
    {[...Array(5)].map((_, index) => (
      <div
        key={`faq-shimmer-${index}`}
        className="mb-4 h-[72px] overflow-hidden rounded-2xl border border-white/20 bg-transparent bg-[length:200%_100%] animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #2D2F39 0%, #363845 50%, #2D2F39 100%)",
        }}
      />
    ))}
  </>
);

const FooterCardShimmer = ({ type }) => (
  <div className="h-[140px] rounded-lg border border-[#2c2a2a] bg-black p-6">
    <div
      className="mb-2 h-6 w-[150px] rounded bg-[length:200%_100%] animate-shimmer"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #2D2F39 0%, #363845 50%, #2D2F39 100%)",
      }}
    />
    <div
      className="h-4 w-[200px] rounded bg-[length:200%_100%] animate-shimmer"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #2D2F39 0%, #363845 50%, #2D2F39 100%)",
      }}
    />
    {type === "feedback" && (
      <div
        className="mt-4 h-12 w-[120px] rounded-full bg-[length:200%_100%] animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #2D2F39 0%, #363845 50%, #2D2F39 100%)",
        }}
      />
    )}
  </div>
);

const HelpAndSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getQna();
        if (response.status && response.data) {
          const formattedFaqs = response.data.map((item) => ({
            key: item.id || Math.random(),
            label: item.question,
            children: item.answer,
          }));
          setFaqItems(formattedFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-5 sm:px-10 lg:px-20 py-10 text-white bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
      <div className="w-full mx-auto">
        <CustomHeader title="Help and Support" />
        <h2 className="w-full sm:w-[80%] py-5 m-0 text-white text-2xl font-semibold leading-snug">
          Welcome to our Mental Health Support Center. Here you'll find answers to commonly asked questions about our
          mental health services, resources, and support systems. If you can't find what you're looking for, don't
          hesitate to reach out to our dedicated support team.
        </h2>

        {loading ? (
          <>
            <FAQShimmer />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FooterCardShimmer type="feedback" />
              <FooterCardShimmer type="support" />
            </div>
          </>
        ) : (
          <Collapse
            accordion
            className="border border-white/20 rounded-2xl bg-transparent"
            items={faqItems}
          />
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black border border-[#2c2a2a] p-2">
            <Space className="w-full flex items-center justify-between md:flex-row flex-col">
              <div className="flex-1">
                <h3 className="m-0 text-white text-xl font-normal">Help us improve</h3>
                <p className="m-0 text-white text-base font-normal">Got a suggestion or found a bug? Let us know!</p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 md:mt-0 h-12 max-w-[200px] w-full rounded-full bg-white text-black text-base font-medium hover:!bg-white hover:!text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] border-none"
              >
                Share feedback
              </Button>
            </Space>
          </Card>

          <Card className="bg-black border border-[#2c2a2a] p-6">
            <div className="flex-1">
              <h3 className="m-0 text-white text-xl font-normal">Need help?</h3>
              <p className="m-0 text-white text-base font-normal">
                reach out to us at <a className="underline text-[#00d885]" href="mailto:info@neure.co.in">info@neure.co.in</a>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HelpAndSupport;

