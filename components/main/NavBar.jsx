"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

import { useSession } from "next-auth/react";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import handleScroll from "@/tools/handleScroll";
import checkPath from "@/tools/checkPath";

const DynamicProfileModal = dynamic(() => import("../modals/users/UserProfileModal"), {
  ssr: false,
});

const DynamicEditModall = dynamic(() => import("../modals/users/EditUserModal"), {
  ssr: false,
});

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Websites", href: "/dashboard/websites", current: false },
  { name: "Team", href: "/dashboard/team", current: false },
  { name: "File manager", href: "/dashboard/file-manager", current: false },
];

const activeLink = classNames(`text-white bg-gray-900`);
const inactiveLink = classNames("text-gray-300 hover:bg-gray-700 hover:text-white");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const pathname = usePathname();

  const { data: session } = useSession();
  const currentUser = session?.user;

  let people = [];
  const [profile, setProfile] = useState("");
  const [sessionImage, setSessionImage] = useState("/user.png");

  const [openProfile, setOpenProfile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [enableScroll, setEnableScroll] = useState(false);
  const [navS, setnavS] = useState("");
  const [componentsLoad, setComponentsLoad] = useState(false);

  const getUser = async () => {
    const { GetUsers } = await import("@/app/calls/GetUsers");
    const data = await GetUsers();
    people.push(...data);
    people.forEach(e => {
      if (e.email === currentUser.email) {
        setSessionImage(e.images);
        setProfile(e);
      }
    });
  };

  //OPEN PROFILE
  const profileSettings = () => {
    setOpenProfile(true);
  };

  handleScroll(158, setnavS, "nav-scroll", "", enableScroll);

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    const initializeFirebase = (await import("@/lib/firebase")).default;
    signOut();
    (await initializeFirebase()).auth.signOut();
  };

  useEffect(() => {
    if (session) {
      if (sessionImage === "/user.png") {
        getUser();
      }
    }
    checkPath(pathname, setEnableScroll);

    setTimeout(() => {
      setComponentsLoad(true);
    }, 1000);
  });

  return session ? (
    <Disclosure
      as="nav"
      className={`bg-gray-800 navbar-main z-20 ${window.innerWidth > 698 ? navS : ""}`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="phoneMenuButton relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start navLogoImageContainter">
                <div className="flex flex-shrink-0 items-center navLogoImageContainter2">
                  <Link href="/dashboard">
                    <Image
                      height={60}
                      width={60}
                      className="h-8 w-auto navLogoImage"
                      src="/dashboard.png"
                      alt="Website logo"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${pathname === item.href ? activeLink : inactiveLink} rounded-md px-3 py-2 text-sm font-medium`}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => (document.body.style.overflow = "hide" ? (document.body.style.overflow = "auto") : null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {!navS || window.innerWidth < 698 ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <span className="relative rounded-full bg-gray-800 p-1 text-gray-400">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <p>{currentUser.name}</p>
                  </span>

                  {/* Profile dropdown */}
                  <Menu
                    as="div"
                    className="relative ml-3"
                  >
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {session?.user ? (
                          typeof sessionImage[0] === "object" ? (
                            <Image
                              className={`h-8 w-8 rounded-full bg-white`}
                              priority={true}
                              height={60}
                              width={60}
                              src={sessionImage[0].downloadURL}
                              alt="Profile Image"
                            />
                          ) : (
                            <img
                              className={`h-8 w-8 rounded-full bg-white`}
                              src={sessionImage ? sessionImage : "/user.png"}
                              alt=""
                            />
                          )
                        ) : null}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => {
                                {
                                  document.body.style.overflow = "hide" ? (document.body.style.overflow = "scroll") : null;
                                  profileSettings();
                                }
                              }}
                              className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 dropMenu")}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/dashboard/settings"
                              className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => handleSignOut()}
                              className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 showPointer")}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <button
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  onClick={() => setnavS("")}
                >
                  Navbar
                </button>
              )}
            </div>
          </div>

          {(componentsLoad || openProfile) && (
            <DynamicProfileModal
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
              profile={profile}
              fromnavbar={true}
              setOpenEdit={setOpenEdit}
            />
          )}

          {(componentsLoad || openEdit) && (
            <DynamicEditModall
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
              editPerson={profile}
              people={people}
              fetchData={getUser}
            />
          )}

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${pathname === item.href ? activeLink : inactiveLink} block rounded-md px-3 py-2 text-base font-medium`}
                  aria-current={item.current ? "page" : undefined}
                >
                  <Disclosure.Button>{item.name}</Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  ) : null;
}
