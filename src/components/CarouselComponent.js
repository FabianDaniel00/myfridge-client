import { Carousel } from "react-bootstrap";
import carousel1 from "../img/carousel1.png";
import carousel2 from "../img/carousel2.png";
import carousel3 from "../img/carousel3.png";

export default function CarouselComponent() {
  return (
    <Carousel style={{ zIndex: "1" }}>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src={carousel1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src={carousel2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img
          style={{ width: "100%", height: "100px" }}
          src={carousel3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}
