import 'package:flutter/material.dart';

class UserCertificatesDownloadPage extends StatelessWidget {
  const UserCertificatesDownloadPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Example options, replace with your actual navigation/routes and images
    final List<_OptionCardData> options = [
      _OptionCardData(
        imgAsset: 'assets/permit_certificate.png',
        label: 'Download Permit Certificate',
        onTap: () {
          Navigator.pushNamed(context, '/user_permit_certificates');
        },
      ),
      _OptionCardData(
        imgAsset: 'assets/nic_receipt.png',
        label: 'Download NIC Receipt',
        onTap: () {
          Navigator.pushNamed(context, '/user_nic_receipt');
        },
      ),
      _OptionCardData(
        imgAsset: 'assets/election_receipt.png',
        label: 'Download Election Receipt',
        onTap: () {
          Navigator.pushNamed(context, '/user_election_receipt');
        },
      ),
      _OptionCardData(
        imgAsset: 'assets/allowance_receipt.png',
        label: 'Download Allowances Receipt',
        onTap: () {
          Navigator.pushNamed(context, '/user_allowance_receipt');
        },
      ),
    ];

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage(
              'assets/background.jpg',
            ), // Place your background image in assets
            fit: BoxFit.cover,
          ),
        ),
        child: Container(
          color: Colors.black.withOpacity(
            0.3,
          ), // Subtle overlay for readability
          child: Column(
            children: [
              const SizedBox(height: 40),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'My Certificates',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              Expanded(
                child: Center(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        for (int i = 0; i < options.length; i++) ...[
                          OptionCard(
                            imgAsset: options[i].imgAsset,
                            label: options[i].label,
                            onTap: options[i].onTap,
                          ),
                          if (i < options.length - 1)
                            Container(
                              width: 2,
                              height: 100,
                              color: const Color(0xFFdadacd),
                              margin: const EdgeInsets.symmetric(
                                horizontal: 10,
                              ),
                            ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class OptionCard extends StatelessWidget {
  final String imgAsset;
  final String label;
  final VoidCallback onTap;

  const OptionCard({
    Key? key,
    required this.imgAsset,
    required this.label,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 8,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 200,
          height: 200,
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 8,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                imgAsset,
                width: 100,
                height: 100,
                fit: BoxFit.contain,
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF921940),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: onTap,
                  child: Text(
                    label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OptionCardData {
  final String imgAsset;
  final String label;
  final VoidCallback onTap;

  _OptionCardData({
    required this.imgAsset,
    required this.label,
    required this.onTap,
  });
}
