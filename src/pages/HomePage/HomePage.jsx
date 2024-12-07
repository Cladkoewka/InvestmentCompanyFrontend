import React from 'react';
import './HomePage.css';
import ServiceCard from './ServiceCard/ServiceCard'; // Импорт нового компонента

// Локальные картинки
import investmentImage from '../../assets/investment.jpg';
import consultingIcon from '../../assets/consulting-icon.jpg';
import projectIcon from '../../assets/project-icon.jpg';
import riskIcon from '../../assets/risk-icon.jpg';
import successIcon from '../../assets/success-icon.jpg';
import clientsIcon from '../../assets/clients-icon.jpg';
import roiIcon from '../../assets/roi-icon.jpg';

const HomePage = () => {
  const services = [
    {
      title: 'Investment Consulting',
      description: 'Personalized advice to optimize your investment strategy. Let us guide you towards the most promising opportunities.',
      backgroundImage: consultingIcon,
    },
    {
      title: 'Risk Assessment',
      description: 'Identifying and minimizing risks to protect your investments. We ensure your portfolio is as secure as possible.',
      backgroundImage: riskIcon,
    },
    {
      title: 'Project Management',
      description: 'Expert management of investment projects for better returns. From planning to execution, we handle it all.',
      backgroundImage: projectIcon,
    },
  ];

  const stats = [
    {
      title: '150+',
      description: 'Successful Projects. These achievements represent our dedication to delivering consistent results for our clients.',
      backgroundImage: successIcon,
    },
    {
      title: '50%',
      description: 'Average Return on Investment. A testament to our commitment to maximizing profitability for our clients.',
      backgroundImage: roiIcon,
    },
    {
      title: '500+',
      description: 'Clients Served. Join the growing list of satisfied investors who trust us with their financial growth.',
      backgroundImage: clientsIcon,
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Investment Projects Management</h1>
          <p>
            Our platform connects investors with profitable projects across various industries.

            Whether you're a beginner or a seasoned investor, we offer tailored solutions to fit your needs.

            Maximize your returns with expert advice, innovative solutions, and personalized investment strategies.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are a leading investment management platform focused on providing personalized and secure 
            investment solutions for our clients. Our team of experts ensures that your money works for you.

            Whether you're new to investing or an experienced investor, we aim to simplify the process 
            and help you make informed decisions. Our approach combines advanced analytics with hands-on expertise.

            Join us on a journey of financial growth and security. With our trusted advice and professional service, 
            your financial goals are within reach.
          </p>
          <img src={investmentImage} alt="Investment Strategy" className="about-img" />
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <p>
          We offer a range of services designed to help you achieve your investment goals. From detailed risk analysis 
          to project management, our expertise ensures your success.
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              backgroundImage={service.backgroundImage}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <h2>Our Impact</h2>
        <p>
          Our achievements speak for themselves. With hundreds of satisfied clients and a proven track record, 
          we continue to set the standard in investment management.
        </p>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <ServiceCard
              key={index}
              title={stat.title}
              description={stat.description}
              backgroundImage={stat.backgroundImage}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
