const Footer = () => {
    return (
      <footer className="bg-blue-600 text-white w-full text-center px-4 py-[10px]">
        <p>This website is created and maintained by &:</p>
        <p className="mt-0">© Copyright: Amit Kumar</p>
        <p className="mt-0">
          Email:{" "}
          <a
            href="mailto:amit18755@gmail.com"
            className="underline text-white"
          >
            amit.mca21.du@gmail.com
          </a>
        </p>
        <p className="mt-0 text-sm">
          Source:{" "}
          <a
            href="https://tourism.bihar.gov.in/en/circuits/buddhist-circuit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white"
          >
            tourism.bihar.gov.in
          </a>{" "}
          and Wikipedia
        </p>
      </footer>
    );
  };
  
  export default Footer;
  