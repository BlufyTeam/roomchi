import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";
import { Moment } from "jalali-moment";
import * as React from "react";

interface PlanDetailsEmailProps {
  planTitle?: string;
  planDescription?: string;
  startDateTime?: string;
  endDateTime?: string;
  roomTitle?: string;
  roomId: string;
  withEnterButton: boolean;
}

export const PlanDetailsEmail = ({
  planTitle,
  planDescription,
  startDateTime,
  endDateTime,
  roomTitle,
  roomId,
  withEnterButton,
}: PlanDetailsEmailProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>جزئیات برنامه: {planTitle}</Preview>
      <Body style={main}>
        <Container>
          {/* <Section style={logo}>
            <Img
              src={`${baseUrl}/static/logo.png`}
              alt="لوگوی شرکت"
              width={100}
              height={50}
            />
          </Section> */}

          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={`https://www.recraft.ai/community?imageId=3313c996-31e8-4bc9-9d64-65c04a30f7af`}
                alt="تصویر سربرگ"
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading style={headingPrimary}>{planTitle}</Heading>

                <Text style={paragraph}>
                  <b>توضیحات: </b>
                  {planDescription}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>زمان شروع: </b>
                  {startDateTime}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>زمان پایان: </b>
                  {endDateTime}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>اتاق: </b>
                  {roomTitle}
                </Text>

                {/* <Text style={paragraph}>
                  اگر نیاز به تغییر در این برنامه دارید، لطفاً وارد حساب کاربری
                  خود شوید یا با تیم پشتیبانی ما تماس بگیرید.
                </Text> */}
              </Column>
            </Row>
            {withEnterButton && (
              <Row style={{ ...boxInfos, paddingTop: "0" }}>
                <Column style={containerButton} colSpan={2}>
                  <Button
                    href={`${process.env.BASE_URL}/user/rooms/${roomId}`}
                    style={button}
                  >
                    شرکت در جلسه
                  </Button>
                </Column>
              </Row>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

PlanDetailsEmail.PreviewProps = {
  planTitle: "جلسه تیمی",
  planDescription: "بحث در مورد پیشرفت پروژه و مراحل بعدی",
  startDateTime: "2023-06-15T10:00:00Z",
  endDateTime: "2023-06-15T11:00:00Z",
  roomTitle: "اتاق کنفرانس الف",
} as PlanDetailsEmailProps;

export default PlanDetailsEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "Vazirmatn, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const paragraph = {
  fontSize: 16,
  lineHeight: "1.5",
  direction: "rtl" as const,
};

const logo = {
  padding: "30px 20px",
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
  fontFamily: "Vazirmatn, sans-serif",
};

const content = {
  backgroundColor: "#ffffff",
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};

const headingPrimary = {
  fontSize: 32,
  fontWeight: "bold",
  textAlign: "center" as const,
  direction: "rtl" as const,
};

const headingSecondary = {
  fontSize: 26,
  fontWeight: "bold",
  textAlign: "center" as const,
  direction: "rtl" as const,
};
