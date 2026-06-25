---
title: "NetPractice: How Computers Find Each Other on the Internet"
date: 2026-06-11
description: "A walkthrough of IP addressing, subnet masks, and routing
  — the core concepts behind the 42 NetPractice project."
tags: ["42"]
---
[`OSI Layers`](#osi--tcpip-layers)
[`TCP/IP`](#osi--tcpip-layers)
[`IP Addressing`](#ip-addressing)
[`Subnet Masks`](#subnet-masks)
[`Switches`](#switches-and-routers)
[`Routers`](#switches-and-routers)
[`Default Gateway`](#default-gateways--next-hop)
[`Next-HOP`](#default-gateways--next-hop)

**NetPractice** is the first networking project of the 42 curriculum. It's a
hands-on puzzle: you're handed small networks of computers, routers, and
switches that *almost* work, and your job is to fill in the missing IP
addresses, subnet masks, and gateways until every machine can reach the ones
it's supposed to talk to.

Solving those puzzles forces you to understand a handful of core ideas — how
devices are addressed, how a network is split into subnets, and how data finds
its way from one machine to another. This post walks through each of them,
roughly in the order they build on one another.

One caveat before we start: this is only an **introduction** to how the
Internet works. The real thing is far more complex, but the concepts below are
the foundation the rest is built on — and they're already enough to make sense
of what happens when you type a URL and a page loads from the other side of the
world.

Communication between devices comes down to sending and receiving data, chunked
into small packets. Before diving into addresses and masks, it helps to know
that this exchange is organized in **layers** that describe a packet's journey
from one machine to another.

## OSI & TCP/IP layers

In order to travel from one machine to another, data must be chunked into small packets. Those packets travel through the layers described in the OSI model.

The **OSI model** (Open Systems Interconnection) is a conceptual framework proposed by the _International Organization for Standardization_ (ISO) that divides network communication into seven layers:

1. **Physical** — converts a stream of raw bits into physical signals over the medium (wires, radio waves).
2. **Data Link** — groups bits into data frames and moves them between two directly connected nodes using MAC addresses (this is where **switches** operate).
3. **Network** — routes packets between different networks using logical addresses, i.e. IP.
4. **Transport** — handles end-to-end data delivery between processes, reliably and in order (TCP) or fast and connectionless (UDP), using ports.
5. **Session** — opens, manages, and closes the conversations between two applications.
6. **Presentation** — translates, encrypts, and compresses data into a form the application can use.
7. **Application** — the protocols users actually interact with (HTTP, DNS, SSH, SMTP).

![OSI Model](https://user.oc-static.com/upload/2021/11/27/16379744768493_P2C5-1.png)

> ### TCP/IP Model
> The TCP/IP model gives us a more practical alternative to the OSI model to comprehend the Internet. It is comprised of five layers that map to the structure and protocols of the Internet.
>
> 1. **Physical Layer**
>
>       Ex: Wires, Radio Waves
>       Describes the physical characteristics of communication.
>
> 2. **Data Link Layer**
>
>       Ex: Ethernet, Token Ring
>       Splits data into frames to be sent across the connection medium.
>
> 3. **Network Layer**
>
>       Ex: IP, ARP, RARP, ICMP
>       Receives the frames from the Data Link layer and sends them to the correct network address, thanks to protocols such as IP (Internet Protocol).
>
> 4. **Transport Layer**
>
>       Ex: TCP, UDP
>       Manages end-to-end delivery between hosts. TCP guarantees reliable, ordered delivery; UDP favors speed over reliability.
>
> 5. **Application Layer**
>
>       Ex: SSH, DNS, FTP, HTTP, SMTP, telnet
>       The protocols and services the end user interacts with.
>

![OSI Model vs TCP/IP Model](https://media.geeksforgeeks.org/wp-content/uploads/20230417045622/OSI-vs-TCP-vs-Hybrid-2.webp)
_The original TCP/IP model merges the Physical and Data Link ones into the Network Access Layer. We kept them separated in the section above for pedagogy._

## IP Addressing

TCP/IP stands for Transmission Control Protocol / Internet Protocol — a set of communication standards that lets computers find and reach each other across networks. When two devices exchange data, this suite is what breaks the data into packets, addresses them, and routes them to the right destination.
 
For that to work, every device on a network needs a unique **IP address**: it tells the network where a packet should be delivered, so data can travel from the sender to the correct recipient and back.
 
The version we use throughout this project is **IPv4**, which represents an address as a 32-bit number. To keep it readable, those 32 bits are split into four 8-bit groups called **octets**, written in decimal and separated by dots — for example `192.168.20.221`. Each octet ranges from 0 to 255, so IPv4 addresses span `0.0.0.0` to `255.255.255.255` (about 4.3 billion possible addresses).
 
> **A note on IPv6.** Because the ~4.3 billion IPv4 addresses are no longer enough for today's Internet, a newer version called **IPv6** was introduced. It uses 128-bit addresses (written in hexadecimal, e.g. `2001:0db8:85a3::8a2e:0370:7334`).

The key idea is that an IP address is made of two parts.
- The **network** part, shared by every device sitting on the same network;
- The **host** part, unique to each device (the host) within that network.
Take `192.168.20.221`: depending on the network it belongs to, a leading chunk of those bits identifies the network, and the rest identifies this specific machine on it. Telling these two parts apart is the whole job of the **subnet mask**, which we look at next.

## Subnet Masks

Subnet masks are used to separate the network address from the host address in an IPv4 address.

A mask is a 32-bit integer divided in four octets. It is always made of a block of contiguous `1`s (the network part) followed by a block of contiguous `0`s (the host part). For example, the mask 255.255.255.0 in binary is:

```
11111111.11111111.11111111.00000000
```

Because the `1`s must stay contiguous, each octet of a mask can only take one of these values: `0, 128, 192, 224, 240, 248, 252, 254, 255`.

To split an IP into its network part and host part, we perform a bitwise AND between the IP and its mask:

```
IP address:         - 10011011.11010100.00000100.00011010   (155.212.  4.  26)
Mask:               - 11111111.11111111.00000000.00000000   (255.255.  0.   0)
-bitwise AND------------------------------------------------------------------
Network Prefix:     - 10011011.11010100.00000000.00000000   (155.212.  0.   0)
-bitwise AND on the inverted mask---------------------------------------------
Host Identifier:    - 00000000.00000000.00000100.00011010   (  0.  0.  4.  26)
```

_Bitwise AND is a binary operation performing the logical AND on each pair of bits of two equal-length binary numbers: if both bits are 1, the result is 1, otherwise the result is 0._

### CIDR Representation

As seen above, the mask tells us how many bits are used for the network prefix and how many are left for the hosts.

In our example, 16 bits define the network prefix. Instead of writing `255.255.0.0`, we can use the CIDR (Classless Inter-Domain Routing) notation: `/16`.

> You can see all CIDR numbers and their decimal values on an [IP Subnet Calculator](https://www.calculator.net/ip-subnet-calculator.html).

### Computing the host range

Knowing the mask of a subnet lets us determine the range of host identifiers, and therefore how many IPs are available.

The range of IP addresses for the network `155.212.0.0/16` goes from `155.212.0.0` to `155.212.255.255`.

Two addresses in this range are reserved:
- `155.212.0.0`: reserved for the **Network Address**;
- `155.212.255.255`: reserved for the **Broadcast Address** (used to send a message to all devices of this network).

Therefore, the **Usable Host IP Range** is from `155.212.0.1` to `155.212.255.254`.

In general, a subnet with `h` host bits provides **2^h − 2** usable addresses.

## Switches and Routers

A **switch** connects computers that are on the **same** network together. It works at the Data Link layer (Layer 2) and forwards frames using MAC addresses.

A **router** connects **different** networks together. It works at the Network layer (Layer 3) and forwards packets using IP addresses. A router has one interface per network it is attached to, each with its own IP address on that network, and it decides which interface to send a packet out of in order to move it closer to its destination.

## Default Gateways / Next-HOP

Direct communication between two machines is possible if they're on the same subnet (they share the same network bits and the same subnet mask).

When a machine needs to reach an IP that is **not** on its own subnet, it applies its mask to the destination IP, concludes that the destination is not local, and realizes it cannot deliver the packets itself. It needs to hand them to a helper that knows how to reach other networks.

The **Default Gateway** is that helper. It's the IP address of a **router on your own subnet** that you forward packets to whenever the destination is off-network and you don't have a more specific rule for that destination.

You can also define gateways or next hops for **specific** destinations, telling the machine which router on its subnet leads to a given network.

>A **hop** is a single leg of a packet's journey — one transfer from one router (or node) to the next. Each router a packet crosses counts as one hop, and reaching a distant destination usually means crossing several hops, router by router.

```
Destination         Next-Hop
42.42.42.0/24       22.22.22.22
```
_To reach the network 42.42.42.0/24, hand the packet to the router 22.22.22.22. (Note that the destination is a **network**, so the host bits are 0.)_

```
Destination         Next-Hop
Default             22.22.22.22
```
_Default Gateway: to reach any IP address that is neither in the routing table nor on the current subnet, hand the packet to the router 22.22.22.22._

## References

- <ins>TCP/IP for Dummies</ins>, 6th edition, Candace Leiden and Marshall Wilensky, 2009;
- [Overlapping Subnets - the Problem](https://www.certskills.com/vlsmo_01_01/), CertSkills, October 8 2014;
- [What is the OSI Model?](https://aws.amazon.com/what-is/osi-model/), AWS;
- [Internet Protocol Suite](https://en.wikipedia.org/wiki/Internet_protocol_suite), Wikipedia.