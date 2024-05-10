import ImageLoader from '../../../components/ImageLoader';
import Heading from '../../../components/newheading/heading/Index';
import classes from './Vision.module.css';

const Vision = (props) => {


    return (
      <div className={classes.Container}>
        <div className={classes.ImageContainer}>
          <ImageLoader
            url="media/website/About us picture.jpeg"
            fit="cover"
            dimensions={{ width: 1600, height: 900 }}
          ></ImageLoader>
        </div>
        
        <div
          className={classes.TextContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Heading
            className="font-lexend"
            aligndesktop="center"
            bold
            noline
            margin="0"
            align="center"
          >
            Our Vision
          </Heading>
          <p className={classes.Text}>
            Innovating and simplifying travel through:
          </p>
          <div className={classes.IconsContainer}>
            <div>
              <div className="center-div" style={{ margin: "0 1.5rem" }}>
                <ImageLoader
                  dimensions={{ height: 100, width: 100 }}
                  width="1.6rem"
                  height="1.6rem"
                  url={"media/icons/values/personalised.svg"}
                />
              </div>
              <p className={classes.IconText}>Personalized</p>
              <p className={classes.IconText}>plans</p>
            </div>
            <div>
              <div className="center-div" style={{ margin: "0 1.5rem" }}>
                <ImageLoader
                  dimensions={{ height: 100, width: 100 }}
                  width="1.6rem"
                  height="1.6rem"
                  url={"media/icons/values/oneclick.svg"}
                />
              </div>
              <p className={classes.IconText}>All bookings</p>
              <p className={classes.IconText}>in one click</p>
            </div>
            <div>
              <div className="center-div" style={{ margin: "0 1.5rem" }}>
                <ImageLoader
                  dimensions={{ height: 100, width: 100 }}
                  width="1.6rem"
                  height="1.6rem"
                  url={"media/icons/values/247.svg"}
                />
              </div>
              <p className={classes.IconText}>24/7</p>
              <p className={classes.IconText}>live support</p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Vision;
