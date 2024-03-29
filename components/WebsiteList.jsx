import Link from "next/link";
import React from "react";

const WebsiteList = ({ websites }) => {
  if (websites.length > 0) {
    return (
      <div className="website-list">
        <ul>
          {websites.map((website, index) => {
            return (
              <div key={index}>
                <li>
                  <img src="/www.png" />
                  <div className="name-type-section">
                    <span className="website-name">{website.name}</span>
                    <span className="website-link">
                      <a
                        href={website.link}
                        target="_blank"
                      >
                        {website.domen}
                      </a>
                    </span>
                    <span className="website-type">{website.hostType}</span>
                  </div>
                  <Link
                    href={`./websites/${website._id}`}
                    id="manage-button"
                  >
                    <button className="manage-button">Manage</button>
                  </Link>
                </li>
                {index < websites.length - 1 ? <hr className="line-break" /> : null}
              </div>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="no-results">
        <span>No sites match your search criteria</span>
      </div>
    );
  }
};

export default WebsiteList;
