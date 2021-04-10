import { Carousel } from "react-bootstrap";

export default function CarouselComponent() {
  return (
    <Carousel style={{ zIndex: "1" }}>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src="https://images.unsplash.com/photo-1614569608266-5b8ec0997fa4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src="https://images.unsplash.com/photo-1606398016782-2f49b8c03e99?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1356&q=80"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src="https://images.unsplash.com/photo-1540961403310-79825242906e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}
